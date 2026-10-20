/**
 * LLM access with failover: Groq first, Gemini when Groq is rate limited or
 * failing. After a Groq 429, Groq is skipped until its retry-after time passes
 * (per Worker isolate), so visitors don't wait on calls that will fail.
 */

export interface LlmEnv {
  GROQ_API_KEY?: string;
  GROQ_MODEL: string;
  GEMINI_API_KEY?: string;
  GEMINI_MODEL: string;
}

export type Turn = { role: "user" | "assistant"; content: string };
export type Provider = "groq" | "gemini";

export class LlmError extends Error {
  constructor(readonly provider: Provider, readonly status: number, detail: string) {
    super(`${provider} ${status}: ${detail.slice(0, 1500)}`);
  }
}

// Both together stay under the widget's 60s request timeout.
const GROQ_TIMEOUT_MS = 20_000;
const GEMINI_TIMEOUT_MS = 35_000;
let groqPausedUntil = 0;

/** Asks for a JSON object; tries each configured provider in turn. */
export async function completeJson(
  env: LlmEnv,
  system: string,
  turns: Turn[],
): Promise<{ data: Record<string, unknown>; provider: Provider }> {
  const errors: LlmError[] = [];
  const started = Date.now();

  if (env.GROQ_API_KEY && Date.now() >= groqPausedUntil) {
    try {
      return { data: parseObject("groq", await groq(env, system, turns)), provider: "groq" };
    } catch (err) {
      const e = toLlmError("groq", err);
      if (e.status === 429) groqPausedUntil = Date.now() + (e.retryAfterMs ?? 60_000);
      console.warn(`Groq failed, ${env.GEMINI_API_KEY ? "falling back to Gemini" : "no fallback configured"}:`, e.message);
      errors.push(e);
    }
  }

  if (env.GEMINI_API_KEY) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        return { data: parseObject("gemini", await gemini(env, system, turns)), provider: "gemini" };
      } catch (err) {
        const e = toLlmError("gemini", err);
        // Gemini often answers 503 "high demand" briefly; retry once if there's time.
        const retry = attempt === 1 && (e.status === 500 || e.status === 503) && Date.now() - started < 20_000;
        if (!retry) {
          errors.push(e);
          break;
        }
        await new Promise((resolve) => setTimeout(resolve, 1_000));
      }
    }
  }

  if (!errors.length) throw new LlmError("groq", 500, "No LLM provider is configured (set GROQ_API_KEY and/or GEMINI_API_KEY)");
  // Report "busy" only when every provider tried was rate limited.
  const last = errors.at(-1)!;
  throw errors.every((e) => e.status === 429) ? last : new LlmError(last.provider, last.status === 429 ? 502 : last.status, errors.map((e) => e.message).join(" | "));
}

async function groq(env: LlmEnv, system: string, turns: Turn[]): Promise<string> {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${env.GROQ_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: env.GROQ_MODEL,
      messages: [{ role: "system", content: system }, ...turns],
      temperature: 0.1,
      // Reasoning models count their thinking against this budget.
      max_completion_tokens: 2048,
      response_format: { type: "json_object" },
      ...(env.GROQ_MODEL.startsWith("openai/gpt-oss") ? { reasoning_effort: "low" } : {}),
    }),
    signal: AbortSignal.timeout(GROQ_TIMEOUT_MS),
  });
  if (!res.ok) throw await httpError("groq", res);
  const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new LlmError("groq", 502, "empty response");
  return content;
}

async function gemini(env: LlmEnv, system: string, turns: Turn[]): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(env.GEMINI_MODEL)}:generateContent`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "x-goog-api-key": env.GEMINI_API_KEY!, "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: system }] },
      contents: turns.map((t) => ({ role: t.role === "assistant" ? "model" : "user", parts: [{ text: t.content }] })),
      generationConfig: {
        maxOutputTokens: 2048,
        responseMimeType: "application/json",
        // A schema constrains the output; the MIME type alone is sometimes ignored.
        responseSchema: {
          type: "OBJECT",
          properties: {
            answer: { type: "STRING" },
            citations: { type: "ARRAY", items: { type: "INTEGER" } },
            found: { type: "BOOLEAN" },
          },
          required: ["answer", "citations", "found"],
          propertyOrdering: ["answer", "citations", "found"],
        },
        thinkingConfig: { thinkingLevel: "low" },
      },
    }),
    signal: AbortSignal.timeout(GEMINI_TIMEOUT_MS),
  });
  if (!res.ok) throw await httpError("gemini", res);
  const data = (await res.json()) as {
    candidates?: { content?: { parts?: { text?: string; thought?: boolean }[] }; finishReason?: string }[];
  };
  const candidate = data.candidates?.[0];
  const content = candidate?.content?.parts
    ?.filter((p) => !p.thought)
    .map((p) => p.text ?? "")
    .join("");
  if (!content) throw new LlmError("gemini", 502, `empty response (${candidate?.finishReason ?? "no candidates"})`);
  return content;
}

function parseObject(provider: Provider, content: string): Record<string, unknown> {
  try {
    // Tolerate a fenced ```json block even though JSON output was requested.
    const parsed = JSON.parse(content.replace(/^\s*```(?:json)?\s*|\s*```\s*$/g, ""));
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) return parsed;
  } catch {
    // Fall through.
  }
  throw new LlmError(provider, 502, `invalid JSON: ${content.slice(0, 120)}`);
}

async function httpError(provider: Provider, res: Response): Promise<LlmError & { retryAfterMs?: number }> {
  const err: LlmError & { retryAfterMs?: number } = new LlmError(provider, res.status, await res.text().catch(() => ""));
  const retryAfter = Number(res.headers.get("retry-after"));
  if (retryAfter > 0) err.retryAfterMs = Math.min(retryAfter, 600) * 1000;
  return err;
}

function toLlmError(provider: Provider, err: unknown): LlmError & { retryAfterMs?: number } {
  if (err instanceof LlmError) return err;
  const timeout = err instanceof Error && (err.name === "TimeoutError" || err.name === "AbortError");
  return new LlmError(provider, timeout ? 504 : 502, err instanceof Error ? err.message : String(err));
}
