# Site assistant — embeddable chatbot (Cloudflare Worker + Groq, Gemini fallback)

A chat widget any website can add with one line. It answers visitors'
questions using **only that website's content** and cites the pages and
sections it used.

```html
<script src="https://neynix-chatbot.<account>.workers.dev/widget.js" data-bot="neynix" defer></script>
```

Optional: `data-position="left"` docks it on the left.

## How it works

- **Sites ("bots")** are listed in [`bots.json`](bots.json). `npm run crawl`
  fetches each site (start URL, sitemap, same-site links, up to `maxPages`,
  respecting `robots.txt`). It splits every page into chunks at its headings
  and stores them in the `BOTS` KV namespace under `bot:<id>`.
- **`/widget.js`** is plain JavaScript, rendered in a Shadow DOM so it neither
  inherits nor breaks the host site's CSS. It uses the site's font, and takes
  its colours and theme from the bot's settings. Conversations last for the
  browser session, so following a citation to another page keeps the chat.
- **Answers:** the Worker sends the site's chunks (the most relevant ~12k
  characters on larger sites) and tells the LLM to answer only from them,
  citing `[n]` after each claim. It then drops any citation that isn't a real
  chunk and renumbers the rest. An answer with no valid citation is replaced
  with "I couldn't find that on the site".
- **LLM failover:** Groq first. If Groq is rate limited (429), errors, times out
  or returns bad JSON, the same request goes to Gemini (retried once on Gemini's brief 503 "high demand" errors). After a 429 the Worker
  skips Groq until its `retry-after` time passes. The `X-Provider` response
  header shows which one answered.
- **Access:** a bot only works on the origins in its `origins` list, so nobody
  can paste your tag on their own site and spend your quota. Questions are
  limited to 10 per minute per visitor per bot.

### API

| Route | |
| --- | --- |
| `GET /widget.js` | The embeddable widget. |
| `GET /v1/bots/:id` | Widget settings: name, theme, accent, greeting, suggestions. |
| `POST /v1/bots/:id/chat` | `{ message, history? }` → `{ answer, citations: [{ n, title, context, page, url, snippet }], found }` |

## Add a site

1. Add an entry to `bots.json`:

   ```json
   "acme": {
     "name": "Acme Bakery",
     "url": "https://acmebakery.com/",
     "origins": ["https://acmebakery.com", "https://www.acmebakery.com"],
     "theme": "light",
     "accent": "#c2410c",
     "greeting": "Hi! Ask me about our menu, hours or catering.",
     "suggestions": ["What are your opening hours?", "Do you do custom cakes?"],
     "maxPages": 30
   }
   ```

   `origins` defaults to the URL's origin; `theme` is `light`, `dark` or `auto`.
   Only crawl sites you own or have permission to crawl.

2. Crawl it into production KV: `npm run crawl -- acme --remote`
3. Send them the snippet with `data-bot="acme"`.

Re-run the crawl after their content changes. The `Deploy chatbot` workflow also
re-crawls every bot daily.

## Setup (once)

```bash
cd chatbot
npm install
npx wrangler login
npx wrangler kv namespace create BOTS     # paste the printed id into wrangler.jsonc
npx wrangler secret put GROQ_API_KEY      # https://console.groq.com/keys
npx wrangler secret put GEMINI_API_KEY    # https://aistudio.google.com/apikey
npm run deploy
npm run crawl -- --remote                 # crawl every bot in bots.json
```

Then set the repository **Variable** `PUBLIC_CHAT_WIDGET_URL` to
`https://neynix-chatbot.<account>.workers.dev/widget.js` and redeploy the site.

To automate deploys and re-crawls, add repository **Secrets**
`CLOUDFLARE_API_TOKEN` (an API token with the "Edit Cloudflare Workers"
template, plus Workers KV Storage: Edit) and `CLOUDFLARE_ACCOUNT_ID`.
[`.github/workflows/chatbot.yml`](../.github/workflows/chatbot.yml) then
deploys the Worker and re-crawls after each site deploy, on chatbot changes,
and daily.

## Run locally

```bash
cd chatbot
cp .dev.vars.example .dev.vars                          # add your keys
npm run crawl -- neynix --url http://localhost:3000/ --local
npm run dev                                             # http://localhost:8787
```

In the project root, set `PUBLIC_CHAT_WIDGET_URL=http://localhost:8787/widget.js`
in `.env.local` and run `npm run dev`.

Without `--local`/`--remote`, `npm run crawl` only writes `.bots/<id>.json`, so
you can inspect what a bot knows.

## Configuration (`wrangler.jsonc`)

| Setting | Purpose |
| --- | --- |
| `GROQ_API_KEY`, `GEMINI_API_KEY` (secrets) | Set at least one. With both, Gemini is the fallback. |
| `GROQ_MODEL` | Default `openai/gpt-oss-120b`. Must support JSON mode. |
| `GEMINI_MODEL` | Default `gemini-3.5-flash-lite`. On the free tier `gemini-3.6-flash` allows only 20 requests a day. Check yours at [ai.dev/rate-limit](https://ai.dev/rate-limit). |
| `BOTS` | KV namespace holding crawled sites. |
| `RATE_LIMITER` | 10 questions per minute per visitor per bot. |
| `DEBUG` | `"true"` adds error details to failed responses. For testing only, e.g. `npx wrangler versions upload --var DEBUG:true`. |

The origin check stops other websites from using a bot from their visitors'
browsers; it can't stop scripts that fake the header, which is what the rate
limit is for. Set spending limits in the Groq and Google consoles as a backstop.
