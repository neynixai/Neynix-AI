import type { APIRoute } from "astro";
import { siteConfig } from "@/config/site";
import { projects } from "@/lib/projects";

// Absolute URLs are required, so the sitemap stays empty until the production domain is set.
export const GET: APIRoute = () => {
  const entries = siteConfig.url
    ? [
        { loc: `${siteConfig.url}/`, priority: "1" },
        ...projects.map((project) => ({ loc: `${siteConfig.url}/work/${project.slug}/`, priority: "0.8" })),
      ]
    : [];
  const urls = entries
    .map(
      ({ loc, priority }) =>
        `  <url>\n    <loc>${loc}</loc>\n    <changefreq>monthly</changefreq>\n    <priority>${priority}</priority>\n  </url>`,
    )
    .join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
};
