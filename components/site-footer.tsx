import { ArrowUpRight } from "lucide-react";
import { Logo } from "@/components/logo";
import { CurrentYear } from "@/components/current-year";
import { getContactLinks, siteConfig } from "@/config/site";
import { navLinks, services } from "@/lib/content";

export function SiteFooter() {
  const contactLinks = getContactLinks();

  return (
    <footer className="border-t border-line bg-elevated">
      <div className="container-page grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_0.7fr_1fr_0.8fr]">
        <div>
          <a href="#top" aria-label="NEYNIX AI — back to top" className="inline-block rounded-sm">
            <Logo />
          </a>
          <p className="mt-6 font-display text-base font-semibold">{siteConfig.tagline}</p>
          <p className="mt-2 max-w-xs text-small text-grey">{siteConfig.shortDescription}</p>
          <p className="mt-4 text-small text-grey">
            Founded by <span className="font-medium text-offwhite">{siteConfig.founder}</span>
          </p>
        </div>

        <FooterColumn title="Navigation">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="text-grey transition-colors hover:text-offwhite">
                {link.label}
              </a>
            </li>
          ))}
        </FooterColumn>

        <FooterColumn title="Services">
          {services.map((service) => (
            <li key={service.id}>
              <a href="#services" className="text-grey transition-colors hover:text-offwhite">
                {service.title}
              </a>
            </li>
          ))}
        </FooterColumn>

        {contactLinks.length > 0 && (
          <FooterColumn title="Connect">
            {contactLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="inline-flex items-center gap-1 text-grey transition-colors hover:text-offwhite"
                >
                  {link.label}
                  {link.external && <ArrowUpRight aria-hidden className="size-3.5" strokeWidth={1.5} />}
                  {link.external && <span className="sr-only">(opens in a new tab)</span>}
                </a>
              </li>
            ))}
          </FooterColumn>
        )}
      </div>

      <div className="border-t border-line">
        <div className="container-page flex flex-col gap-2 py-6 text-xs text-grey sm:flex-row sm:items-center sm:justify-between">
          <p>
            © <CurrentYear /> {siteConfig.name}. All rights reserved.
          </p>
          <p>Independent AI engineering studio</p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <nav aria-label={`Footer ${title.toLowerCase()}`}>
      <h2 className="text-sm font-semibold">{title}</h2>
      <ul className="mt-5 space-y-3 text-small">{children}</ul>
    </nav>
  );
}
