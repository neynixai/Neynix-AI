# NEYNIX AI — website

Single-page site for NEYNIX AI, an independent AI engineering studio.
Next.js (App Router) · TypeScript · Tailwind CSS v4 · Lucide icons.
Type: Space Grotesk (headings) and Inter (all text and UI), self-hosted via `next/font`.

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
```

Other scripts: `npm run build`, `npm run lint`, `npm run typecheck`,
`npm run assets` (regenerates logo files from the source image).
`npm run build` writes the static site to `out/`.

## Deployment — GitHub Pages

The site is a fully static export (`output: "export"` in `next.config.ts`).
`.github/workflows/deploy.yml` builds it on every push to `main` and publishes
`out/` to GitHub Pages at `https://<owner>.github.io/<repo>/` — the workflow
passes the `/<repo>` base path to the build automatically.

One-time setup (repository admin): **Settings → Pages → Build and deployment →
Source: GitHub Actions**.

## Configuration

The live contact details (email, LinkedIn, GitHub, Formspree form) are set in
`config/site.ts`. To override one without editing code, set a repository
**Variable** with the same name (Settings → Secrets and variables → Actions →
Variables) or put it in `.env.local` for local development, then redeploy.
To hide a link, set its value in `config/site.ts` to `""`.

| Variable | Effect |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical origin. Defaults to the GitHub Pages URL in CI; set it if you move to a custom domain. |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Shows "Email NEYNIX AI" and the footer email link. |
| `NEXT_PUBLIC_LINKEDIN_URL` / `NEXT_PUBLIC_GITHUB_URL` | Footer "Connect" links. |
| `NEXT_PUBLIC_CONTACT_FORM_ENDPOINT` | Enables the contact form. GitHub Pages can't run server code, so messages go to a form service that accepts a JSON POST — e.g. create a form at [Formspree](https://formspree.io) and paste its `https://formspree.io/f/…` URL. The form only reports success on a 2xx response. |

"Start a conversation" points to the best configured channel: the form, then
email, then LinkedIn. With nothing configured, the contact section shows only
the headline (plus a note in development).

Brand copy and constants live in `config/site.ts`; service and nav content in
`lib/content.ts`.

## Brand assets

- `brand/neynix-logo-source.webp` — the supplied logo (source of truth).
- `brand/design-reference.png` — the landing-page design mockup.
- `public/brand/neynix-mark.png` — transparent mark for light backgrounds.
- `public/brand/neynix-mark-light.png` — reversed mark for dark backgrounds.
- `app/icon.png`, `app/apple-icon.png` — favicon / app icon.
- `app/opengraph-image.png` — social preview image (1200×630).

The marks and icons come from `scripts/generate-brand-assets.mjs`. If a vector
(SVG) master of the logo becomes available, swap it in and regenerate.

## Content notes

- The three "Selected work" entries are labelled **Project concept**. Replace
  them in `components/work.tsx` with verified projects as they are completed,
  and only add case-study links when those pages exist.
- No testimonials, client logos, metrics or founder credentials are included.

## Structure

```
app/            layout, page, globals.css, icons, OG image, robots, sitemap
components/     header, hero, services, philosophy, approach, work, about, why,
                contact (+ form), footer, logo, ui primitives
config/         site.ts (brand, contact, SEO, form endpoint)
lib/            content.ts · contact-validation.ts
```
