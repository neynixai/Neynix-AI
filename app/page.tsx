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

export default function Home() {
  return (
    <>
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
