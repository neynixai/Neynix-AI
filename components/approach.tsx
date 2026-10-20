import { SectionHeader } from "@/components/ui";

const steps = [
  { title: "Discover", body: "Understand the business problem, existing workflow, users, and constraints." },
  { title: "Design", body: "Select a suitable architecture, define the scope, and establish a practical plan." },
  {
    title: "Build",
    body: "Develop the solution iteratively, integrating AI, data, APIs, and application logic where useful.",
  },
  {
    title: "Validate",
    body: "Test behavior, evaluate edge cases, and prepare the solution for its intended environment.",
  },
];

export function Approach() {
  return (
    <section id="approach" aria-labelledby="approach-title" className="section-pad border-t border-line bg-elevated">
      <div className="container-page">
        <SectionHeader
          id="approach-title"
          eyebrow="Our approach"
          index="03 — How we work"
          title="Clear thinking. Careful execution."
          lede="Every project starts with the problem, not the technology. The goal is to build the simplest useful solution that can evolve with your needs."
        />

        <ol className="mt-16 grid gap-0 lg:grid-cols-4 lg:gap-8">
          {steps.map((step, i) => (
            <li
              key={step.title}
              className="reveal relative grid grid-cols-[3rem_1fr] border-l border-line pb-10 pl-6 last:pb-0 lg:block lg:border-l-0 lg:border-t lg:pb-0 lg:pl-0 lg:pt-7"
            >
              {/* Step marker on the timeline */}
              <span aria-hidden className="absolute -left-[3px] top-1 size-[5px] bg-lime lg:-top-[3px] lg:left-0" />
              <span className="font-mono text-sm font-medium">0{i + 1}</span>
              <div className="lg:mt-6">
                <h3 className="text-xl font-semibold tracking-tight">{step.title}</h3>
                <p className="mt-3 max-w-xs text-sm leading-relaxed text-grey">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>

        <p className="reveal mt-16 flex flex-col gap-2 rounded-xl border border-line bg-obsidian px-6 py-5 text-sm text-grey sm:flex-row sm:items-center sm:gap-6">
          <span className="eyebrow shrink-0 !text-offwhite">Direct collaboration</span>
          <span>
            You work with the engineer designing and building your solution — from the first conversation to the
            final review.
          </span>
        </p>
      </div>
    </section>
  );
}
