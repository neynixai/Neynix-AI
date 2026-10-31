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
`dist/` to GitHub Pages. The repository is named `neynixai.github.io`, so the
site is served at the root, https://neynixai.github.io/. Google takes a site's
favicon and name from the root of its hostname, so the site must stay there
(or move to a custom domain). Under any other repository name the site would
be served at `https://<owner>.github.io/<repo>/`, and the workflow passes that
`/<repo>` base path to the build automatically.

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
| `PUBLIC_GOOGLE_SITE_VERIFICATION` | Adds Google Search Console's verification tag. Use the `content` value from the HTML-tag method. |
| `PUBLIC_CHAT_WIDGET_URL` | Shows the site assistant (chat button, bottom-right). Set it to the chatbot Worker's `/widget.js` URL — see [`chatbot/README.md`](chatbot/README.md). |

"Start a conversation" points to the best configured channel: the form, then
email, then LinkedIn. With nothing configured, the contact section shows only
the headline (plus a note in development).

Brand copy and constants live in `src/config/site.ts`; service and nav content
in `src/lib/content.ts`.

## Brand assets

- `brand/neynix-brand-board.webp` — the brand board (logo, lockups, app icons,
  banner): the visual reference.
- `src/lib/mark.ts` — the mark itself: a 3D shape (tapered capsules blended
  with a smooth union, plus a sphere) and the 2D paths traced from it. The
  header, footer, icons and the hero's 3D render all come from here.
- `brand/neynix-mark.svg` — vector master of the mark.
- `public/icon.svg`, `public/icon.png`, `public/apple-icon.png` — favicon and
  app icons (the mark on a dark tile).
- `public/og-image.png` — social preview (1200×630): a capture of the 3D mark
  with the wordmark and tagline.
- `src/assets/brand/mark-3d.webp` — a still of the hero's 3D mark in its
  opening pose (shader at t = 0, no tilt, `uShift` 0; transparent). It shows
  until WebGL draws and is the image search engines can use as the home
  page's thumbnail. Recapture it if the shape or shader lighting changes.

`npm run assets` regenerates the SVG master and icons from `src/lib/mark.ts`.

## Motion

- **Hero:** the mark rendered in 3D with WebGL (ray-marched from the same
  shape, `src/scripts/mark-3d.ts`). It floats and leans toward the pointer.
- **Contact:** a flowing 3D wave with a lime crest (`src/scripts/wave-3d.ts`).
- **Work cards and project screenshots:** perspective tilt with a following
  highlight (`src/scripts/tilt.ts`).

No 3D library is loaded; both effects are small fragment shaders
(`src/scripts/webgl.ts`). They pause off-screen, render a single still frame
for visitors who prefer reduced motion, and fall back to the flat mark and
contour lines when WebGL is unavailable.

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
src/lib/         content.ts · projects.ts · mark.ts · contact-validation.ts · paths.ts
src/scripts/     WebGL hero mark and wave, card tilt
src/assets/      images processed at build time
public/          icons and social image, copied as-is
chatbot/         embeddable site assistant: Cloudflare Worker, Groq with Gemini fallback, cited answers
```
