import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export const dynamic = "force-static";

// Absolute URLs are required, so the sitemap stays empty until the production domain is set.
export default function sitemap(): MetadataRoute.Sitemap {
  if (!siteConfig.url) return [];
  return [{ url: `${siteConfig.url}/`, changeFrequency: "monthly", priority: 1 }];
}
