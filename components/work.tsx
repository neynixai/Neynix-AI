import Image, { type StaticImageData } from "next/image";
import { SectionHeader } from "@/components/ui";
import caModeScreenshot from "@/public/work/ca-mode.webp";

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
  image: StaticImageData;
  imageAlt: string;
  status: ProjectStatus;
  href?: string;
}[] = [
  {
    title: "CA Mode",
    category: "AI agents · Personal finance",
    description:
      "A local-first finance copilot with two agents: one answers general finance questions, the other analyses an INDmoney portfolio through read-only MCP tools, daily snapshots, and charts with a full call trace.",
    image: caModeScreenshot,
    imageAlt:
      "CA Mode home screen: net worth, P&L and goal cards, recent chats, and a portfolio overview with a 7-day trend and market insights.",
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
                className={`relative aspect-[16/10] overflow-hidden border-b border-line bg-obsidian ${
                  wide ? "md:w-3/5 md:shrink-0 md:border-r md:border-b-0" : ""
                }`}
              >
                <Image
                  src={project.image}
                  alt={project.imageAlt}
                  fill
                  sizes={wide ? "(min-width: 768px) 60vw, 100vw" : "(min-width: 768px) 50vw, 100vw"}
                  className="object-cover object-left-top transition-transform duration-700 ease-out group-hover:scale-[1.025]"
                />
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
