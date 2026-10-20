import type { ReactNode } from "react";
import { SectionHeader } from "@/components/ui";

type ProjectStatus = "poc" | "in-build" | "completed" | "hosted";

/** Badge label and dot style for each stage of a project. */
const statuses: Record<ProjectStatus, { label: string; dot: string }> = {
  poc: { label: "POC", dot: "border border-offwhite/50" },
  "in-build": { label: "In build", dot: "border border-lime" },
  completed: { label: "Completed", dot: "bg-offwhite" },
  hosted: { label: "Hosted", dot: "bg-lime" },
};

/**
 * Verified projects only. Update each project's status as it moves from POC to
 * hosted, and only add a link once the destination page exists.
 */
const projects: {
  title: string;
  category: string;
  description: string;
  preview: ReactNode;
  status: ProjectStatus;
  href?: string;
}[] = [
  {
    title: "CA Mode",
    category: "AI agents · Personal finance",
    description:
      "A local-first finance copilot with two agents: one answers general finance questions, the other analyses an INDmoney portfolio through read-only MCP tools, daily snapshots, and charts with a full call trace.",
    preview: <CaModePreview />,
    status: "in-build",
    href: "https://github.com/Nishaanth419/CAMode",
  },
];

export function Work() {
  // A lone project gets a wide card so the grid does not leave an empty column.
  const wide = projects.length === 1;
  return (
    <section id="work" aria-labelledby="work-title" className="section-pad border-t border-line bg-obsidian">
      <div className="container-page">
        <SectionHeader
          id="work-title"
          eyebrow="Engineering in practice"
          index="04 — Work"
          title="Ideas, translated into systems."
          lede="Projects built and in progress, each marked with where it stands today — from proof of concept to hosted. More work will be published here as it progresses."
        />

        <ul className="mt-14 grid gap-5 md:grid-cols-2">
          {projects.map((project) => (
            <li
              key={project.title}
              className={`reveal group flex flex-col overflow-hidden rounded-xl border border-line bg-elevated transition-colors duration-300 hover:border-line-strong ${
                wide ? "md:col-span-2 md:flex-row" : ""
              }`}
            >
              <div
                aria-hidden
                className={`relative aspect-[16/10] overflow-hidden border-b border-line bg-obsidian ${
                  wide ? "md:w-1/2 md:shrink-0 md:border-r md:border-b-0" : ""
                }`}
              >
                <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.025]">
                  {project.preview}
                </div>
              </div>
              <div className={`flex flex-1 flex-col p-6 ${wide ? "md:justify-center md:p-10" : ""}`}>
                <p className="eyebrow">{project.category}</p>
                <h3 className="mt-3 text-title">{project.title}</h3>
                <p className={`mt-3 text-body text-grey ${wide ? "" : "flex-1"}`}>{project.description}</p>
                <p className="mt-6 flex flex-wrap items-center gap-4">
                  <span className="inline-flex items-center gap-2 rounded-full border border-line bg-obsidian px-3 py-1 text-xs font-medium text-offwhite/80">
                    <span aria-hidden className={`size-1.5 rounded-full ${statuses[project.status].dot}`} />
                    <span className="sr-only">Status: </span>
                    {statuses[project.status].label}
                  </span>
                  {project.href && (
                    <a
                      href={project.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-offwhite underline decoration-line-strong underline-offset-4 transition-colors hover:decoration-offwhite"
                    >
                      View on GitHub<span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  )}
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

function CaModePreview() {
  const trend = "M14 62 L30 56 L46 59 L62 48 L78 51 L94 40 L110 43 L126 32";
  return (
    <svg viewBox="0 0 320 200" className="size-full" fill="none">
      {/* chat panel */}
      <g transform="translate(26 30)">
        <rect width="150" height="140" rx="8" fill={c.panel} stroke={c.line} />
        <rect x="12" y="14" width="44" height="14" rx="7" fill={c.raised} stroke={c.strong} />
        <rect x="18" y="19.5" width="32" height="3" rx="1.5" fill={c.grey} />
        <rect x="60" y="14" width="44" height="14" rx="7" stroke={c.line} />
        <rect x="66" y="19.5" width="32" height="3" rx="1.5" fill={c.strong} />
        <rect x="66" y="40" width="72" height="16" rx="8" fill={c.raised} />
        <rect x="74" y="46" width="52" height="4" rx="2" fill={c.grey} />
        <rect x="12" y="66" width="110" height="46" rx="6" fill={c.raised} />
        {[76, 85, 94].map((y, j) => (
          <rect key={y} x="20" y={y} width={j === 2 ? 52 : 92} height="3.5" rx="1.75" fill={c.grey} />
        ))}
        {/* call trace */}
        {[0, 1, 2].map((i) => (
          <g key={i} transform={`translate(${12 + i * 30} 120)`}>
            <circle cx="3" cy="3" r="3" fill={i === 2 ? c.accent : c.strong} />
            {i < 2 && <path d="M8 3 H28" stroke={c.strong} strokeDasharray="2 2" />}
          </g>
        ))}
      </g>
      {/* portfolio card */}
      <g transform="translate(188 30)">
        <rect width="108" height="140" rx="8" fill={c.raised} stroke={c.strong} />
        <rect x="12" y="14" width="40" height="3.5" rx="1.75" fill={c.grey} />
        <rect x="12" y="24" width="62" height="7" rx="3.5" fill={c.bright} />
        <g transform="translate(-6 30) scale(0.78)">
          <path d={`${trend} L126 78 L14 78 Z`} fill={c.accent} fillOpacity="0.08" />
          <path d={trend} stroke={c.accent} strokeWidth="1.6" strokeLinejoin="round" />
        </g>
        <circle cx="34" cy="112" r="14" stroke={c.line} strokeWidth="6" />
        <circle
          cx="34"
          cy="112"
          r="14"
          stroke={c.bright}
          strokeWidth="6"
          strokeDasharray="56 88"
          transform="rotate(-90 34 112)"
        />
        {[104, 112, 120].map((y) => (
          <rect key={y} x="58" y={y} width="36" height="3" rx="1.5" fill={c.strong} />
        ))}
      </g>
    </svg>
  );
}
