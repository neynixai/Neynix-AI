import { Boxes, FileSearch, Network, Sparkle, type LucideIcon } from "lucide-react";
import { SectionHeader } from "@/components/ui";
import { services } from "@/lib/content";

const icons: Record<(typeof services)[number]["id"], LucideIcon> = {
  agents: Network,
  llm: FileSearch,
  software: Boxes,
  products: Sparkle,
};

export function Services() {
  return (
    <section id="services" aria-labelledby="services-title" className="section-pad border-t border-line bg-elevated">
      <div className="container-page">
        <SectionHeader
          id="services-title"
          eyebrow="What we build"
          index="01 — Services"
          title={
            <>
              Intelligent software.
              <br className="hidden sm:block" /> Engineered for real work.
            </>
          }
          lede="From AI-powered workflows to complete applications, we build systems that connect useful intelligence with real business needs."
        />

        <ul className="mt-14 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => {
            const Icon = icons[service.id];
            return (
              <li key={service.id} className="reveal group relative flex flex-col bg-elevated p-6 sm:p-7">
                {/* Hairline that draws across the top on hover. */}
                <span
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-lime transition-transform duration-500 ease-out group-hover:scale-x-100"
                />
                <div className="flex items-start justify-between">
                  <Icon
                    aria-hidden
                    className="size-7 text-offwhite transition-transform duration-300 group-hover:-translate-y-0.5"
                    strokeWidth={1.25}
                  />
                  <span className="font-mono text-label text-grey">{service.number}</span>
                </div>
                <h3 className="mt-10 text-title">{service.title}</h3>
                <p className="mt-3 text-body text-grey">{service.description}</p>
                <ul className="mt-6 space-y-2.5 border-t border-line pt-5">
                  {service.capabilities.map((capability) => (
                    <li key={capability} className="flex items-center gap-3 text-small text-offwhite/80">
                      <span aria-hidden className="size-1 shrink-0 bg-grey" />
                      {capability}
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
