import { Brain, ChartColumnIncreasing, Database, FileText, LayoutGrid, type LucideIcon } from "lucide-react";
import { SectionHeader } from "@/components/ui";

const flow: { label: string; caption: string; icon: LucideIcon }[] = [
  { label: "Data", caption: "Your documents, systems, and data.", icon: Database },
  { label: "Context", caption: "Relevant information through retrieval and structured data.", icon: FileText },
  { label: "Reasoning", caption: "LLMs and agentic workflows.", icon: Brain },
  { label: "Tools", caption: "APIs, databases, and integrated systems.", icon: LayoutGrid },
  { label: "Outcome", caption: "Useful, actionable results in your workflow.", icon: ChartColumnIncreasing },
];

const principles = [
  {
    title: "Context",
    body: "Use relevant documents, structured data, and retrieval to provide appropriate information to AI systems.",
  },
  {
    title: "Orchestration",
    body: "Coordinate models, tools, APIs, and databases through controlled workflows.",
  },
  {
    title: "Evaluation",
    body: "Test outputs, trace execution, and measure system behavior using meaningful evaluations.",
  },
  {
    title: "Integration",
    body: "Connect intelligent applications with existing systems and real business workflows.",
  },
];

export function Philosophy() {
  return (
    <section aria-labelledby="philosophy-title" className="section-pad relative overflow-hidden bg-obsidian">
      <div className="container-page">
        <SectionHeader
          id="philosophy-title"
          eyebrow="How we think"
          index="02 — Philosophy"
          title="More than a model call."
          lede="Useful AI requires more than connecting an API. It requires thoughtful architecture, reliable data flows, evaluation, and integration into the systems people already use."
        />

        <figure className="reveal relative mt-16">
          <ol className="relative grid gap-0 md:grid-cols-5 md:gap-4">
            {/* Connector — horizontal on desktop, vertical on mobile. */}
            <div aria-hidden className="absolute inset-y-7 left-7 w-px bg-line-strong md:hidden">
              <span className="motion-pulse absolute left-1/2 size-1.5 -translate-x-1/2 rounded-full bg-lime animate-travel-y" />
            </div>
            <div aria-hidden className="absolute inset-x-[10%] top-9 hidden h-px bg-line-strong md:block">
              <span className="motion-pulse absolute top-1/2 size-1.5 -translate-y-1/2 rounded-full bg-lime animate-travel-x" />
            </div>

            {flow.map(({ label, caption, icon: Icon }, i) => (
              <li key={label} className="relative flex gap-5 py-4 md:flex-col md:items-center md:py-0 md:text-center">
                <span className="relative flex size-14 shrink-0 items-center justify-center rounded-lg border border-line bg-elevated md:size-[4.5rem]">
                  <Icon aria-hidden className="size-5 md:size-6" strokeWidth={1.4} />
                </span>
                <div className="pt-1 md:mt-5 md:pt-0">
                  <p className="font-mono text-label font-medium uppercase">
                    <span className="text-grey">0{i + 1} </span>
                    {label}
                  </p>
                  <p className="mt-2 max-w-[13rem] text-small text-grey md:mx-auto">{caption}</p>
                </div>
              </li>
            ))}
          </ol>
          <figcaption className="eyebrow relative mt-10 text-center">
            Conceptual flow — how we approach an AI system, not a product
          </figcaption>
        </figure>

        <dl className="mt-20 grid gap-x-10 gap-y-10 border-t border-line pt-12 sm:grid-cols-2 lg:grid-cols-4">
          {principles.map((p, i) => (
            <div key={p.title} className="reveal">
              <dt className="flex items-baseline gap-3 font-display text-title font-semibold">
                <span className="font-mono text-label font-normal text-grey">0{i + 1}</span>
                {p.title}
              </dt>
              <dd className="mt-3 text-body text-grey">{p.body}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
