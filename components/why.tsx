import { ChartLine, CodeXml, Layers, Users, type LucideIcon } from "lucide-react";

const reasons: { title: string; body: string; icon: LucideIcon }[] = [
  {
    title: "Direct collaboration",
    body: "Work directly with the person designing and building the solution.",
    icon: Users,
  },
  {
    title: "Engineering-first decisions",
    body: "Choose technologies based on the problem rather than trends.",
    icon: CodeXml,
  },
  {
    title: "Practical implementation",
    body: "Focus on useful outcomes rather than impressive demos alone.",
    icon: Layers,
  },
  {
    title: "Designed to evolve",
    body: "Favor maintainable code, clear architecture, and measurable behavior.",
    icon: ChartLine,
  },
];

export function Why() {
  return (
    <section aria-labelledby="why-title" className="section-pad border-t border-line bg-obsidian">
      <div className="container-page">
        <div className="reveal flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">Why NEYNIX AI</p>
            <h2 id="why-title" className="mt-4 max-w-3xl text-heading">
              Independent by design. Ambitious by nature.
            </h2>
          </div>
          <p aria-hidden className="eyebrow hidden shrink-0 md:block">
            05 — Why NEYNIX
          </p>
        </div>

        <ul className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {reasons.map(({ title, body, icon: Icon }) => (
            <li key={title} className="reveal flex gap-4 lg:flex-col">
              <Icon aria-hidden className="mt-0.5 size-6 shrink-0" strokeWidth={1.4} />
              <div>
                <h3 className="text-title">{title}</h3>
                <p className="mt-2 text-body text-grey">{body}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
