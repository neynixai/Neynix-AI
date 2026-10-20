import type { NextConfig } from "next";

// GitHub Pages serves the site from /<repo>; the deploy workflow passes that
// prefix in. Locally it is empty, so the site runs at the root.
const basePath = process.env.PAGES_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  // Fully static output (out/) so the site can be hosted on GitHub Pages.
  output: "export",
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
  poweredByHeader: false,
};

export default nextConfig;
