import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { siteConfig } from "@/config/site";
import "./globals.css";

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
  themeColor: "#fafafc",
  colorScheme: "light",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:text-white"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
