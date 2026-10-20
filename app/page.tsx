import { About } from "@/components/about";
import { Approach } from "@/components/approach";
import { Contact } from "@/components/contact";
import { Hero } from "@/components/hero";
import { Philosophy } from "@/components/philosophy";
import { Services } from "@/components/services";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Why } from "@/components/why";
import { Work } from "@/components/work";
import { GITHUB_URL, LINKEDIN_URL, siteConfig } from "@/config/site";

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteConfig.name,
  slogan: siteConfig.tagline,
  description: siteConfig.seo.description,
  ...(siteConfig.url ? { url: `${siteConfig.url}/` } : {}),
  ...(siteConfig.contact.email ? { email: siteConfig.contact.email } : {}),
  founder: {
    "@type": "Person",
    name: siteConfig.founder,
    jobTitle: `Founder, ${siteConfig.name}`,
    sameAs: [LINKEDIN_URL, GITHUB_URL].filter(Boolean),
  },
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
      />
      <div id="top" />
      <SiteHeader />
      <main id="main">
        <Hero />
        <Services />
        <Philosophy />
        <Approach />
        <Work />
        <About />
        <Why />
        <Contact />
      </main>
      <SiteFooter />
    </>
  );
}
