import type { ReactNode } from "react";
import { SectionHeader } from "@/components/ui";

/**
 * Project concepts. Replace with verified portfolio projects as they are
 * completed, and only add a case-study link once the destination page exists.
 */
const projects: { title: string; category: string; description: string; preview: ReactNode }[] = [
  {
    title: "Knowledge Intelligence",
    category: "LLM applications · RAG",
    description:
      "An AI knowledge assistant that retrieves relevant information from documents and generates grounded responses.",
    preview: <KnowledgePreview />,
  },
  {
    title: "Agentic Operations",
    category: "AI agents · Automation",
    description:
      "A tool-using workflow that coordinates tasks, retrieves authoritative information, and routes decisions for review when necessary.",
    preview: <AgentPreview />,
  },
  {
    title: "Operational Insights",
    category: "Data · Software engineering",
    description:
      "A data-driven application that transforms operational information into searchable views, diagnostics, and useful insights.",
    preview: <InsightsPreview />,
  },
];

export function Work() {
  return (
    <section id="work" aria-labelledby="work-title" className="section-pad border-t border-line bg-obsidian">
      <div className="container-page">
        <SectionHeader
          id="work-title"
          eyebrow="Engineering in practice"
          index="04 — Work"
          title="Ideas, translated into systems."
          lede="Explore the kinds of problems intelligent software can solve. These are illustrative project concepts — verified work will be published here as it is completed."
        />

        <ul className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <li
              key={project.title}
              className="reveal group flex flex-col overflow-hidden rounded-xl border border-line bg-elevated transition-colors duration-300 hover:border-line-strong"
            >
              <div
                aria-hidden
                className="relative aspect-[16/10] overflow-hidden border-b border-line bg-obsidian"
              >
                <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.025]">
                  {project.preview}
                </div>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <p className="eyebrow !text-[0.625rem]">{project.category}</p>
                <h3 className="mt-3 text-xl font-semibold tracking-tight">{project.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-grey">{project.description}</p>
                <p className="mt-6">
                  <span className="inline-flex items-center gap-2 rounded-full border border-line bg-obsidian px-3 py-1 text-[0.6875rem] font-medium text-offwhite/80">
                    <span aria-hidden className="size-1.5 rounded-full border border-offwhite/50" />
                    Project concept
                  </span>
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ── Abstract interface sketches in the site palette. Decorative only. ── */

const c = {
  panel: "#191b17", // elevated surface
  raised: "#22251f", // emphasised panel
  line: "#2a2d27",
  strong: "#3b3e37",
  grey: "#85877e",
  bright: "#f5f5f0",
  accent: "#d7ff64", // one highlight per sketch
};

function KnowledgePreview() {
  return (
    <svg viewBox="0 0 320 200" className="size-full" fill="none">
      {/* stacked documents */}
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(${34 + i * 10} ${46 - i * 8})`}>
          <rect width="92" height="116" rx="6" fill={c.panel} stroke={c.line} />
          <rect x="12" y="14" width="44" height="5" rx="2.5" fill={i === 2 ? c.bright : c.strong} />
          {[30, 42, 54, 66, 78].map((y, j) => (
            <rect key={y} x="12" y={y} width={j % 2 ? 56 : 68} height="3.5" rx="1.75" fill={c.strong} />
          ))}
        </g>
      ))}
      {/* assistant panel */}
      <g transform="translate(160 34)">
        <rect width="128" height="132" rx="8" fill={c.raised} stroke={c.strong} />
        <rect x="12" y="14" width="60" height="16" rx="8" fill={c.panel} />
        <rect x="18" y="20" width="40" height="4" rx="2" fill={c.grey} />
        <rect x="12" y="42" width="104" height="52" rx="6" fill={c.panel} />
        {[52, 61, 70, 79].map((y, j) => (
          <rect key={y} x="20" y={y} width={j === 3 ? 48 : 86} height="3.5" rx="1.75" fill={c.grey} />
        ))}
        <rect x="12" y="104" width="34" height="14" rx="7" stroke={c.accent} />
        <rect x="50" y="104" width="34" height="14" rx="7" stroke={c.strong} />
        <rect x="19" y="109.5" width="20" height="3" rx="1.5" fill={c.accent} />
        <rect x="57" y="109.5" width="20" height="3" rx="1.5" fill={c.grey} />
      </g>
      <path d="M136 100 H160" stroke={c.grey} strokeDasharray="2 3" />
    </svg>
  );
}

function AgentPreview() {
  const node = (x: number, y: number, label: number, active = false) => (
    <g transform={`translate(${x} ${y})`}>
      <rect width="64" height="34" rx="6" fill={active ? c.raised : c.panel} stroke={active ? c.strong : c.line} />
      <circle cx="13" cy="17" r="4" fill={active ? c.grey : c.strong} />
      <rect x="22" y="12" width={label} height="4" rx="2" fill={active ? c.grey : c.strong} />
      <rect x="22" y="20" width={label - 10} height="3" rx="1.5" fill={c.strong} />
    </g>
  );
  return (
    <svg viewBox="0 0 320 200" className="size-full" fill="none">
      <g stroke={c.grey} strokeOpacity="0.6">
        <path d="M86 100 H120" />
        <path d="M184 100 C200 100 200 62 216 62" />
        <path d="M184 100 C200 100 200 138 216 138" />
      </g>
      {node(22, 83, 30)}
      {node(120, 83, 32, true)}
      {node(216, 45, 28)}
      {node(216, 121, 28, true)}
      <g transform="translate(228 166)">
        <rect width="40" height="14" rx="7" fill={c.panel} stroke={c.strong} />
        <path d="M12 7 l3 3 l6 -6" stroke={c.accent} strokeWidth="1.2" />
        <rect x="24" y="5.5" width="10" height="3" rx="1.5" fill={c.grey} />
      </g>
      <path d="M248 155 V166" stroke={c.grey} strokeOpacity="0.5" strokeDasharray="2 2" />
    </svg>
  );
}

function InsightsPreview() {
  const bars = [38, 56, 44, 72, 60, 84, 66, 92, 74];
  return (
    <svg viewBox="0 0 320 200" className="size-full" fill="none">
      <g transform="translate(26 30)">
        <rect width="170" height="140" rx="8" fill={c.panel} stroke={c.line} />
        <rect x="14" y="14" width="50" height="5" rx="2.5" fill={c.bright} />
        <rect x="14" y="25" width="32" height="3.5" rx="1.75" fill={c.strong} />
        {bars.map((h, i) => (
          <rect key={i} x={16 + i * 16} y={124 - h} width="9" height={h} rx="1.5" fill={i === 7 ? c.accent : c.strong} />
        ))}
        <path d="M14 124 H156" stroke={c.line} />
      </g>
      <g transform="translate(208 30)">
        <rect width="88" height="76" rx="8" fill={c.panel} stroke={c.line} />
        <circle cx="44" cy="38" r="22" stroke={c.line} strokeWidth="8" />
        <circle
          cx="44"
          cy="38"
          r="22"
          stroke={c.bright}
          strokeWidth="8"
          strokeDasharray="96 138"
          transform="rotate(-90 44 38)"
        />
      </g>
      <g transform="translate(208 114)">
        <rect width="88" height="56" rx="8" fill={c.panel} stroke={c.line} />
        {[14, 26, 38].map((y) => (
          <g key={y}>
            <rect x="12" y={y} width="34" height="3.5" rx="1.75" fill={c.strong} />
            <rect x="58" y={y} width="18" height="3.5" rx="1.75" fill={c.line} />
          </g>
        ))}
      </g>
    </svg>
  );
}
