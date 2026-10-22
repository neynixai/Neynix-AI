# NEYNIX AI — website

Single-page site for NEYNIX AI, an independent AI engineering studio.
Astro · TypeScript · Tailwind CSS v4 · Lucide icons. Ships as static HTML
with a few small scripts (mobile menu, contact form) and no framework runtime.
Type: Space Grotesk (headings) and Inter (all text and UI), self-hosted via Fontsource.

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
```

Other scripts: `npm run build`, `npm run preview` (serves the build),
`npm run check` (type and template checks), `npm run assets` (regenerates logo
files from the source image). `npm run build` writes the static site to `dist/`.

## Deployment — GitHub Pages

The site is fully static (`output: "static"` in `astro.config.mjs`).
`.github/workflows/deploy.yml` builds it on every push to `main` and publishes
`dist/` to GitHub Pages at `https://<owner>.github.io/<repo>/` — the workflow
passes the `/<repo>` base path to the build automatically.

One-time setup (repository admin): **Settings → Pages → Build and deployment →
Source: GitHub Actions**.

## Configuration

The live contact details (email, LinkedIn, GitHub, contact form) are set in
`src/config/site.ts`. To override one without editing code, set a repository
**Variable** with the same name (Settings → Secrets and variables → Actions →
Variables) or put it in `.env.local` for local development, then redeploy.
To hide a link, set its value in `src/config/site.ts` to `""`.

| Variable | Effect |
| --- | --- |
| `PUBLIC_SITE_URL` | Canonical origin. Defaults to the GitHub Pages URL in CI; set it if you move to a custom domain. |
| `PUBLIC_CONTACT_EMAIL` | Shows "Email NEYNIX AI" and the footer email link. |
| `PUBLIC_LINKEDIN_URL` / `PUBLIC_GITHUB_URL` | Footer "Connect" links. |
| `PUBLIC_WEB3FORMS_ACCESS_KEY` | Enables the contact form. GitHub Pages can't run server code, so the form posts to [Web3Forms](https://web3forms.com), which emails each message to the address the access key was created for (the sender's email becomes the reply-to). Create a free key there and paste it here; it is public by design. The form only reports success when Web3Forms confirms delivery. |
| `PUBLIC_CHAT_WIDGET_URL` | Shows the site assistant (chat button, bottom-right). Set it to the chatbot Worker's `/widget.js` URL — see [`chatbot/README.md`](chatbot/README.md). |

"Start a conversation" points to the best configured channel: the form, then
email, then LinkedIn. With nothing configured, the contact section shows only
the headline (plus a note in development).

Brand copy and constants live in `src/config/site.ts`; service and nav content
in `src/lib/content.ts`.

## Brand assets

- `brand/neynix-logo-source.webp` — the supplied logo (source of truth).
- `brand/design-reference.png` — the landing-page design mockup.
- `src/assets/brand/neynix-mark.png` — transparent mark for light backgrounds.
- `src/assets/brand/neynix-mark-light.png` — reversed mark for dark backgrounds.
- `public/icon.png`, `public/apple-icon.png` — favicon / app icon.
- `public/og-image.png` — social preview image for the home page (1200×630).

Images in `src/assets/` are resized and converted to WebP at build time by
`astro:assets`; files in `public/` are served as they are.

The marks and icons come from `scripts/generate-brand-assets.mjs`. If a vector
(SVG) master of the logo becomes available, swap it in and regenerate.

## Content notes

- Projects live in `src/lib/projects.ts`; each one gets a page at
  `/work/<slug>/`. Every project has a `description` (the page's search and
  social description, about 150 characters) and `tags` (shown on the work card
  and project page, and emitted as the page's keywords and `article:tag`
  meta). Only add verified projects.
- No testimonials, client logos, metrics or founder credentials are included.

## Structure

```
src/pages/       index, work/[slug] (one page per project), 404, robots.txt, sitemap.xml
src/layouts/     BaseLayout: <head> metadata (description, keywords, Open Graph, JSON-LD)
src/components/  header, hero, services, philosophy, approach, work, about, why,
                 contact (+ Web3Forms form), footer, logo, ui primitives
src/config/      site.ts (brand, contact, SEO, form key)
src/lib/         content.ts · projects.ts · contact-validation.ts · paths.ts
src/assets/      images processed at build time
public/          icons and social image, copied as-is
chatbot/         embeddable site assistant: Cloudflare Worker, Groq with Gemini fallback, cited answers
```
