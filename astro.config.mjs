// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import process from "node:process";
import { loadEnv } from "vite";

const env = loadEnv(process.env.NODE_ENV ?? "production", process.cwd(), "");

// GitHub Pages serves the site from /<repo>; the deploy workflow passes that
// prefix in. Locally it is empty, so the site runs at the root.
const base = env.PAGES_BASE_PATH || "/";
const siteUrl = env.PUBLIC_SITE_URL;

export default defineConfig({
  // Fully static output (dist/) so the site can be hosted on GitHub Pages.
  output: "static",
  ...(siteUrl ? { site: new URL(siteUrl).origin } : {}),
  base,
  trailingSlash: "always",
  // Port 3000 matches the chatbot's allowed local origin (chatbot/bots.json).
  server: { port: 3000 },
  vite: { plugins: [tailwindcss()] },
});
