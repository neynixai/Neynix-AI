import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { siteConfig } from "@/config/site";
import "./globals.css";

// Self-hosted at build time by next/font (no runtime requests to Google) with
// metric-matched fallbacks to minimise layout shift while the fonts load.
const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-inter" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], display: "swap", variable: "--font-space-grotesk" });

export const metadata: Metadata = {
  // Absolute URLs (canonical, Open Graph) need the production domain; until it
  // is configured we fall back to localhost so metadata still resolves in dev.
  // Origin only: Next adds the GitHub Pages basePath to file-based images itself.
  metadataBase: new URL(siteConfig.url ? new URL(siteConfig.url).origin : "http://localhost:3000"),
  title: siteConfig.seo.title,
  description: siteConfig.seo.description,
  keywords: [...siteConfig.seo.keywords],
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.founder }],
  creator: siteConfig.founder,
  ...(siteConfig.url ? { alternates: { canonical: `${siteConfig.url}/` } } : {}),
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    title: siteConfig.seo.title,
    description: siteConfig.seo.description,
    ...(siteConfig.url ? { url: `${siteConfig.url}/` } : {}),
    locale: "en",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.seo.title,
    description: siteConfig.seo.description,
  },
};

export const viewport: Viewport = {
  themeColor: "#111310",
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-lime focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-obsidian"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
