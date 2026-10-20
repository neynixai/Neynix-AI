/*
 * Site assistant widget. Add to any page:
 *   <script src="https://<worker>/widget.js" data-bot="<bot id>" defer></script>
 * Optional: data-position="left" to dock on the left.
 *
 * Renders inside a Shadow DOM so the host page's CSS can't affect it (and it
 * can't affect the page). Answers are inserted as text, never as HTML.
 */
(() => {
  const script =
    document.currentScript || document.querySelector('script[src*="/widget.js"][data-bot]');
  const botId = script && script.dataset.bot;
  if (!botId) return console.warn("[site assistant] Add data-bot=\"<bot id>\" to the widget script tag.");
  window.__siteAssistant = window.__siteAssistant || {};
  if (window.__siteAssistant[botId]) return;
  window.__siteAssistant[botId] = true;

  const api = `${new URL(script.src).origin}/v1/bots/${encodeURIComponent(botId)}`;
  const storeKey = `site-assistant:${botId}`;
  const left = script.dataset.position === "left";

  fetch(api)
    .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
    .then((config) => (document.body ? mount(config) : addEventListener("DOMContentLoaded", () => mount(config))))
    .catch((err) => console.warn(`[site assistant] "${botId}" is not available on this site:`, err.message));

  function mount(config) {
    const state = load();
    let sending = false;

    // A custom element name, so host-page rules like "body > div" don't match it.
    const host = document.createElement("site-assistant-widget");
    host.setAttribute("data-bot", botId);
    const shadow = host.attachShadow({ mode: "open" });
    const accent = /^#[0-9a-f]{3,8}$/i.test(config.accent || "") ? config.accent : "#2563eb";
    const style = document.createElement("style");
    style.textContent = css(accent, readableOn(accent), left);
    shadow.append(style);

    const theme = ["light", "dark"].includes(config.theme) ? config.theme : "auto";
    const root = h("div", { class: "root", "data-theme": theme });
    shadow.append(root);

    const launcher = h("button", { class: "launcher", type: "button", "aria-expanded": "false", "aria-label": `Ask about ${config.name}` });
    const panel = h("div", { class: "panel", role: "dialog", "aria-label": `${config.name} assistant`, hidden: "" });
    const log = h("div", { class: "log", "aria-live": "polite" });
    const input = h("textarea", { rows: "1", maxlength: "500", placeholder: "Ask a question…", "aria-label": "Your question" });
    const send = h("button", { class: "send", type: "submit", "aria-label": "Send question", disabled: "" }, icon("send"));
    const form = h("form", { class: "composer" }, input, send);

    panel.append(
      h("div", { class: "head" },
        h("div", {}, h("p", { class: "title" }, `Ask ${config.name}`), h("p", { class: "sub" }, "Answers come only from this website, with sources.")),
        h("button", { class: "close", type: "button", "aria-label": "Close" }, icon("close")),
      ),
      log,
      form,
    );
    root.append(panel, launcher);
    document.body.append(host);

    const setOpen = (open) => {
      panel.hidden = !open;
      launcher.setAttribute("aria-expanded", String(open));
      launcher.replaceChildren(icon(open ? "close" : "chat"));
      state.open = open;
      save();
      if (open) {
        render();
        input.focus();
      }
    };
    launcher.addEventListener("click", () => setOpen(panel.hidden));
    panel.querySelector(".close").addEventListener("click", () => {
      setOpen(false);
      launcher.focus();
    });
    root.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !panel.hidden) {
        setOpen(false);
        launcher.focus();
      }
    });
    input.addEventListener("input", () => {
      send.disabled = sending || !input.value.trim();
      input.style.height = "auto";
      input.style.height = `${Math.min(input.scrollHeight, 128)}px`;
    });
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey && !e.isComposing) {
        e.preventDefault();
        ask(input.value);
      }
    });
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      ask(input.value);
    });

    async function ask(question) {
      const message = question.trim();
      if (!message || sending) return;
      const history = state.messages
        .filter((m) => m.role !== "error")
        .slice(-6)
        .map((m) => ({ role: m.role, content: m.content }));
      state.messages.push({ role: "user", content: message });
      input.value = "";
      input.style.height = "auto";
      sending = true;
      send.disabled = true;
      render();
      try {
        const res = await fetch(`${api}/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message, history }),
          signal: AbortSignal.timeout ? AbortSignal.timeout(60000) : undefined,
        });
        const data = await res.json().catch(() => ({}));
        if (res.ok && typeof data.answer === "string") {
          state.messages.push({ role: "assistant", content: data.answer, citations: Array.isArray(data.citations) ? data.citations : [] });
        } else {
          state.messages.push({ role: "error", content: data.error || "Something went wrong. Please try again." });
        }
      } catch {
        state.messages.push({ role: "error", content: "Network error — please check your connection and try again." });
      }
      sending = false;
      send.disabled = !input.value.trim();
      save();
      render();
      input.focus();
    }

    function render() {
      log.replaceChildren();
      if (!state.messages.length) {
        if (config.greeting) log.append(h("p", { class: "msg bot" }, config.greeting));
        if (config.suggestions && config.suggestions.length) {
          const list = h("div", { class: "suggestions" });
          for (const s of config.suggestions) {
            const b = h("button", { type: "button", class: "chip" }, s);
            b.addEventListener("click", () => ask(s));
            list.append(b);
          }
          log.append(list);
        }
      }
      let lastQuestion = null;
      for (const m of state.messages) {
        if (m.role === "user") log.append((lastQuestion = h("p", { class: "msg user" }, m.content)));
        else if (m.role === "error") log.append(h("p", { class: "msg error", role: "alert" }, m.content));
        else log.append(answer(m));
      }
      if (sending) log.append(h("p", { class: "typing" }, h("span", { class: "dot" }), h("span", { class: "dot" }), h("span", { class: "dot" }), " Searching the site…"));
      // Keep the latest question in view, so a long answer is read from its start.
      if (lastQuestion) log.scrollTop = lastQuestion.offsetTop - log.offsetTop - 16;
    }

    function answer(m) {
      const byN = new Map(m.citations.map((c) => [c.n, c]));
      const wrap = h("div", { class: "msg bot" });

      const inline = (line) => {
        const out = [];
        for (const part of line.split(/(\[\d+\])/g)) {
          const n = /^\[(\d+)\]$/.exec(part);
          const c = n && byN.get(Number(n[1]));
          out.push(c ? link(c, h("sup", {}, `[${c.n}]`), "ref", `Source ${c.n}: ${c.title}`) : part);
        }
        return out;
      };

      // Consecutive "- " lines become a list, other lines paragraphs.
      let list = null;
      for (const raw of m.content.split("\n")) {
        const line = raw.trim();
        if (!line) continue;
        if (/^[-*•]\s+/.test(line)) {
          if (!list) wrap.append((list = h("ul")));
          list.append(h("li", {}, ...inline(line.replace(/^[-*•]\s+/, ""))));
        } else {
          list = null;
          wrap.append(h("p", {}, ...inline(line)));
        }
      }

      if (m.citations.length) {
        const sources = h("ol", { class: "sources" });
        for (const c of m.citations) {
          sources.append(
            h("li", {},
              link(c, null, "source", null,
                h("span", { class: "num" }, `[${c.n}]`),
                h("span", { class: "meta" },
                  h("span", { class: "name" }, c.title, c.context ? h("span", { class: "ctx" }, ` · ${c.context}`) : ""),
                  h("span", { class: "snippet" }, c.snippet),
                ),
              ),
            ),
          );
        }
        wrap.append(h("p", { class: "label" }, "Sources"), sources);
      }
      return wrap;
    }

    function link(c, child, cls, label, ...children) {
      const safe = /^https?:\/\//i.test(c.url) ? c.url : "#";
      const a = h("a", { href: safe, class: cls, title: c.snippet }, ...(child ? [child] : children));
      if (label) a.setAttribute("aria-label", label);
      // On phones the panel covers the page; close it so the cited section is visible.
      a.addEventListener("click", () => {
        if (matchMedia("(max-width: 480px)").matches) setOpen(false);
      });
      return a;
    }

    function load() {
      try {
        const saved = JSON.parse(sessionStorage.getItem(storeKey) || "null");
        if (saved && Array.isArray(saved.messages)) return saved;
      } catch {
        // Storage unavailable.
      }
      return { open: false, messages: [] };
    }
    function save() {
      try {
        sessionStorage.setItem(storeKey, JSON.stringify({ open: state.open, messages: state.messages.slice(-30) }));
      } catch {
        // Storage unavailable.
      }
    }

    launcher.append(icon("chat"));
    // Reopen after following a citation to another page.
    if (state.open) setOpen(true);
  }

  function h(tag, attrs = {}, ...children) {
    const el = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
    for (const c of children) el.append(c);
    return el;
  }

  function icon(name) {
    const paths = {
      chat: "M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z",
      close: "M18 6 6 18M6 6l12 12",
      send: "M12 19V5M5 12l7-7 7 7",
    };
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("aria-hidden", "true");
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", paths[name]);
    svg.append(path);
    return svg;
  }

  /** Black or white, whichever reads better on the accent colour. */
  function readableOn(hex) {
    let s = hex.slice(1);
    if (s.length <= 4) s = [...s].map((c) => c + c).join("");
    const [r, g, b] = [0, 2, 4].map((i) => parseInt(s.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
    return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.179 ? "#111111" : "#ffffff";
  }

  function css(accent, onAccent, left) {
    const side = left ? "left" : "right";
    return `
:host { display: contents; }
.root {
  --accent: ${accent}; --on-accent: ${onAccent};
  --bg: #ffffff; --surface: #f4f4f5; --text: #18181b; --muted: #6b6b73; --line: #e4e4e7; --input: #a1a1aa;
  font-family: inherit; font-size: 14px; line-height: 1.55; color: var(--text);
  letter-spacing: normal; text-align: left; -webkit-font-smoothing: antialiased;
}
.root[data-theme="dark"] {
  --bg: #18191a; --surface: #242527; --text: #f2f2ef; --muted: #9a9b94; --line: #303130; --input: #5f615b;
}
@media (prefers-color-scheme: dark) {
  .root[data-theme="auto"] {
    --bg: #18191a; --surface: #242527; --text: #f2f2ef; --muted: #9a9b94; --line: #303130; --input: #5f615b;
  }
}
* { box-sizing: border-box; }
p { margin: 0; }
button, textarea { font: inherit; color: inherit; }
svg { width: 22px; height: 22px; fill: none; stroke: currentColor; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }

.launcher {
  position: fixed; bottom: 20px; ${side}: 20px; z-index: 2147483000;
  width: 56px; height: 56px; border-radius: 50%; border: 0; cursor: pointer;
  display: grid; place-items: center; background: var(--accent); color: var(--on-accent);
  box-shadow: 0 8px 28px rgba(0,0,0,.28); transition: transform .15s ease;
}
.launcher:hover { transform: scale(1.05); }

.panel {
  position: fixed; bottom: 88px; ${side}: 20px; z-index: 2147483000;
  width: 380px; height: min(580px, calc(100vh - 120px));
  display: flex; flex-direction: column; overflow: hidden;
  background: var(--bg); border: 1px solid var(--line); border-radius: 14px;
  box-shadow: 0 24px 64px rgba(0,0,0,.3);
}
.panel[hidden] { display: none; }
@media (max-width: 480px) {
  .panel { left: 10px; right: 10px; width: auto; top: 10px; bottom: 84px; height: auto; }
}

.head { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; padding: 14px 16px; border-bottom: 1px solid var(--line); }
.title { font-weight: 600; font-size: 15px; }
.sub { color: var(--muted); font-size: 12.5px; margin-top: 2px; }
.close { background: none; border: 0; padding: 4px; cursor: pointer; color: var(--muted); border-radius: 6px; }
.close svg { width: 18px; height: 18px; }

.log { flex: 1; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 14px; }
.msg.user { align-self: flex-end; max-width: 85%; background: var(--surface); padding: 9px 13px; border-radius: 12px; white-space: pre-wrap; overflow-wrap: anywhere; }
.msg.bot { display: flex; flex-direction: column; gap: 8px; overflow-wrap: anywhere; }
.msg.bot ul { margin: 0; padding-left: 20px; display: flex; flex-direction: column; gap: 4px; }
.msg.error { color: #dc2626; }
.root[data-theme="dark"] .msg.error { color: #ff8a7a; }

.ref { color: inherit; text-decoration: none; }
.ref sup { color: var(--accent); font-size: .72em; padding: 0 1px; }
.root[data-theme="light"] .ref sup { filter: brightness(.75); }
.ref:hover sup { text-decoration: underline; }

.label { color: var(--muted); font-size: 12px; font-weight: 500; margin-top: 4px; }
.sources { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 6px; }
.source { display: flex; gap: 8px; padding: 8px 10px; border: 1px solid var(--line); border-radius: 8px; color: inherit; text-decoration: none; }
.source:hover { border-color: var(--input); }
.num { color: var(--accent); font-size: 12px; font-variant-numeric: tabular-nums; flex-shrink: 0; }
.root[data-theme="light"] .num { filter: brightness(.75); }
.meta { min-width: 0; display: flex; flex-direction: column; gap: 2px; }
.name { font-size: 12.5px; font-weight: 500; }
.ctx { color: var(--muted); font-weight: 400; }
.snippet { color: var(--muted); font-size: 12px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }

.suggestions { display: flex; flex-direction: column; align-items: flex-start; gap: 6px; }
.chip { background: none; border: 1px solid var(--line); border-radius: 8px; padding: 6px 11px; cursor: pointer; text-align: left; }
.chip:hover { border-color: var(--input); }

.typing { color: var(--muted); display: flex; align-items: center; gap: 3px; }
.dot { width: 5px; height: 5px; border-radius: 50%; background: currentColor; animation: blink 1.2s infinite ease-in-out; }
.dot:nth-child(2) { animation-delay: .15s; } .dot:nth-child(3) { animation-delay: .3s; }
@keyframes blink { 0%, 80%, 100% { opacity: .25; } 40% { opacity: 1; } }
@media (prefers-reduced-motion: reduce) { .dot { animation: none; } .launcher { transition: none; } }

.composer { display: flex; align-items: flex-end; gap: 8px; padding: 10px; border-top: 1px solid var(--line); }
textarea {
  flex: 1; resize: none; min-height: 42px; max-height: 128px; padding: 10px 12px;
  background: var(--surface); border: 1px solid var(--line); border-radius: 10px; outline: none; font-size: 16px;
}
@media (min-width: 481px) { textarea { font-size: 14px; } }
textarea:focus { border-color: var(--input); }
textarea::placeholder { color: var(--muted); }
.send { width: 42px; height: 42px; flex-shrink: 0; border: 0; border-radius: 10px; cursor: pointer; display: grid; place-items: center; background: var(--accent); color: var(--on-accent); }
.send:disabled { opacity: .45; cursor: not-allowed; }
.send svg { width: 20px; height: 20px; }
`;
  }
})();
