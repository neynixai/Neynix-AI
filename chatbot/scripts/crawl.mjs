/**
 * Crawls each bot's website and stores what the chatbot may answer from.
 *
 *   node scripts/crawl.mjs [botId ...] [--local | --remote] [--url <start url>]
 *
 * Bots are defined in bots.json. For each one this fetches the start URL, its
 * sitemap and same-site links (up to maxPages, honouring robots.txt), splits
 * every page into chunks at its headings, and writes the bot record to
 * .bots/<id>.json. With --local or --remote it is also uploaded to the BOTS KV
 * namespace (local dev storage or the deployed one). --url overrides the start
 * URL, e.g. to crawl a dev server.
 */
import { execFileSync } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { parse } from "node-html-parser";

const root = fileURLToPath(new URL("..", import.meta.url));
const USER_AGENT = "SiteAssistantBot/1.0 (+chatbot knowledge crawler)";
const DEFAULT_MAX_PAGES = 30;
const MAX_CHUNK = 1500;

const SKIP = new Set(["script", "style", "noscript", "svg", "img", "picture", "video", "audio", "iframe", "form", "button", "template", "nav", "dialog"]);
const BLOCK = new Set([
  "p", "li", "ul", "ol", "div", "section", "article", "header", "footer", "aside", "main", "dl", "dt", "dd",
  "blockquote", "figure", "figcaption", "br", "h5", "h6", "tr", "table", "pre", "address",
]);
const HEADING = /^h[1-4]$/;
const NOT_PAGES = /\.(pdf|png|jpe?g|gif|webp|avif|svg|ico|zip|gz|mp4|mp3|webm|css|js|json|xml|txt|woff2?)$/i;

const args = process.argv.slice(2);
const target = args.includes("--remote") ? "remote" : args.includes("--local") ? "local" : null;
const urlFlag = args.indexOf("--url");
const urlOverride = urlFlag >= 0 ? args[urlFlag + 1] : undefined;
const ids = args.filter((a, i) => !a.startsWith("--") && args[i - 1] !== "--url");

const bots = JSON.parse(await readFile(`${root}bots.json`, "utf8"));
const selected = ids.length ? ids : Object.keys(bots);
for (const id of selected) {
  if (!bots[id]) throw new Error(`Unknown bot "${id}" — add it to bots.json first.`);
  if (!/^[a-z0-9-]{1,40}$/.test(id)) throw new Error(`Bot id "${id}" must be lowercase letters, digits and dashes.`);
}

await mkdir(`${root}.bots`, { recursive: true });
for (const id of selected) {
  const config = bots[id];
  const start = new URL(urlOverride ?? config.url);
  console.log(`\n[${id}] crawling ${start.href}`);
  const pages = await crawl(start, config.maxPages ?? DEFAULT_MAX_PAGES);
  const chunks = dedupe(pages.flatMap((p) => chunkPage(p)));
  if (!chunks.length) throw new Error(`[${id}] no content found at ${start.href}`);

  const record = {
    id,
    name: config.name,
    origins: config.origins ?? [start.origin],
    theme: config.theme ?? "auto",
    accent: config.accent ?? "#2563eb",
    greeting: config.greeting ?? "",
    suggestions: config.suggestions ?? [],
    crawledAt: new Date().toISOString(),
    chunks: chunks.map((c, i) => ({ id: i + 1, ...c })),
  };
  const file = `${root}.bots/${id}.json`;
  await writeFile(file, JSON.stringify(record));
  const chars = chunks.reduce((n, c) => n + c.text.length, 0);
  console.log(`[${id}] ${pages.length} pages → ${chunks.length} chunks (${chars} chars) → .bots/${id}.json`);

  if (target) {
    execFileSync("npx", ["wrangler", "kv", "key", "put", `bot:${id}`, "--binding", "BOTS", "--path", file, `--${target}`], {
      cwd: root,
      stdio: "inherit",
    });
    console.log(`[${id}] uploaded to ${target} KV`);
  }
}

async function crawl(start, maxPages) {
  // Only pages under the start URL's directory, e.g. /Neynix-AI/ on GitHub Pages.
  const scope = new URL(start.pathname.endsWith("/") ? start.pathname : start.pathname.replace(/[^/]*$/, ""), start);
  const disallow = await robotsDisallow(start.origin);
  const inScope = (u) =>
    u.origin === start.origin && u.href.startsWith(scope.href) && !NOT_PAGES.test(u.pathname) && !disallow.some((p) => u.pathname.startsWith(p));

  const queue = [normalize(start)];
  for (const loc of await sitemapUrls(start.origin, scope)) queue.push(loc);
  const seen = new Set();
  const pages = [];

  while (queue.length && pages.length < maxPages) {
    const href = queue.shift();
    if (seen.has(href)) continue;
    seen.add(href);
    const url = new URL(href);
    if (!inScope(url)) continue;

    let res;
    try {
      res = await fetch(href, { headers: { "User-Agent": USER_AGENT, Accept: "text/html" }, redirect: "follow" });
    } catch (err) {
      console.warn(`  skip ${href}: ${err.message}`);
      continue;
    }
    if (!res.ok || !(res.headers.get("content-type") ?? "").includes("text/html")) continue;
    const finalUrl = normalize(new URL(res.url || href));
    if (finalUrl !== href && seen.has(finalUrl)) continue;
    seen.add(finalUrl);

    const doc = parse(await res.text());
    if (/noindex/i.test(doc.querySelector('meta[name="robots"]')?.getAttribute("content") ?? "")) continue;
    pages.push({ url: finalUrl, doc });
    console.log(`  ${finalUrl}`);

    for (const a of doc.querySelectorAll("a[href]")) {
      try {
        const next = new URL(a.getAttribute("href"), finalUrl);
        if (inScope(next)) queue.push(normalize(next));
      } catch {
        // Ignore malformed hrefs.
      }
    }
  }
  return pages;
}

/** Splits a page into chunks, one per heading, each linked to the nearest anchor. */
function chunkPage({ url, doc }) {
  const pageTitle = clean(doc.querySelector("title")?.text ?? "") || new URL(url).pathname;
  const body = doc.querySelector("main") ?? doc.querySelector("body") ?? doc;
  const chunks = [];
  // h1..h4 currently in scope, so a chunk can show its parent heading.
  const stack = [];
  let current = { heading: null, context: null, anchor: "", parts: [] };

  const flush = () => {
    const lines = current.parts
      .join("")
      .split("\n")
      .map(clean)
      .filter((line) => line && !/^\d+$/.test(line)); // drop step/card numbers like "01"
    // Long sections become several chunks, split between lines.
    let text = "";
    for (const line of lines) {
      if (text && text.length + line.length > MAX_CHUNK) {
        push(text);
        text = "";
      }
      text += (text ? "\n" : "") + line;
    }
    if (text) push(text);
  };
  const push = (text) =>
    chunks.push({
      page: pageTitle,
      title: current.heading ?? pageTitle,
      context: current.context,
      url: current.anchor ? `${url}#${current.anchor}` : url,
      text,
    });

  const walk = (node, topLevel) => {
    if (node.nodeType === 3) {
      current.parts.push(node.text);
      return;
    }
    if (node.nodeType !== 1) return;
    const tag = node.tagName.toLowerCase();
    if (SKIP.has(tag) || node.getAttribute("aria-hidden") === "true" || node.hasAttribute("hidden")) return;
    if (node.classList.contains("sr-only") || node.classList.contains("visually-hidden")) return;
    // Without a <main>, leave out the site-wide header and footer.
    if (topLevel && (tag === "header" || tag === "footer")) return;

    if (HEADING.test(tag)) {
      flush();
      const level = Number(tag[1]);
      while (stack.length && stack.at(-1).level >= level) stack.pop();
      const heading = clean(node.text);
      const parent = stack.at(-1);
      // Link to the heading's own section, else to its parent heading's.
      const anchor = anchorFor(node) || parent?.anchor || "";
      // An <h1> is effectively the page title, so it is not shown as context.
      current = { heading, context: parent && parent.level > 1 ? parent.text : null, anchor, parts: [] };
      stack.push({ level, text: heading, anchor });
      return;
    }

    const href = tag === "a" ? (node.getAttribute("href") ?? "") : "";
    // Same-page links are navigation and calls to action, not content.
    if (href.startsWith("#")) return;
    const sep = BLOCK.has(tag) ? "\n" : " ";
    current.parts.push(sep);
    for (const child of node.childNodes) walk(child, false);
    // Keep where external links point, so contact details are answerable.
    if (/^(mailto:|tel:|https?:)/.test(href)) current.parts.push(` (${href.replace(/^(mailto|tel):/, "")})`);
    current.parts.push(sep);
  };

  for (const child of body.childNodes) walk(child, body.tagName?.toLowerCase() === "body");
  flush();
  return chunks;
}

/** The heading's own id, or the closest enclosing element's id. */
function anchorFor(el) {
  for (let node = el; node && node.tagName; node = node.parentNode) {
    const id = node.getAttribute?.("id");
    if (id && !["main", "__next", "root", "app"].includes(id)) return encodeURIComponent(id);
    if (["MAIN", "BODY"].includes(node.tagName)) break;
  }
  return "";
}

function dedupe(chunks) {
  const seen = new Set();
  return chunks.filter((c) => (seen.has(c.text) ? false : seen.add(c.text)));
}

async function sitemapUrls(origin, scope) {
  const urls = [];
  for (const loc of [`${scope.href}sitemap.xml`, `${origin}/sitemap.xml`]) {
    try {
      const res = await fetch(loc, { headers: { "User-Agent": USER_AGENT } });
      if (!res.ok) continue;
      for (const m of (await res.text()).matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)) {
        try {
          urls.push(normalize(new URL(m[1])));
        } catch {
          // Ignore malformed entries.
        }
      }
      if (urls.length) break;
    } catch {
      // No sitemap.
    }
  }
  return urls;
}

/** Disallow rules for all user agents (a simple prefix match, no wildcards). */
async function robotsDisallow(origin) {
  try {
    const res = await fetch(`${origin}/robots.txt`, { headers: { "User-Agent": USER_AGENT } });
    if (!res.ok) return [];
    const rules = [];
    let applies = false;
    for (const raw of (await res.text()).split("\n")) {
      const [key, ...rest] = raw.replace(/#.*/, "").split(":");
      const value = rest.join(":").trim();
      if (/^user-agent$/i.test(key.trim())) applies = value === "*";
      else if (applies && /^disallow$/i.test(key.trim()) && value) rules.push(value.replace(/\*.*$/, ""));
    }
    return rules;
  } catch {
    return [];
  }
}

function normalize(u) {
  const url = new URL(u);
  url.hash = "";
  url.search = "";
  return url.href;
}

function clean(s) {
  return s
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#x27;|&#39;|&rsquo;/g, "’")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}
