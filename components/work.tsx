import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProjectStatusBadge } from "@/components/project-status";
import { SectionHeader } from "@/components/ui";
import { projects } from "@/lib/projects";

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
              key={project.slug}
              className={`reveal group relative flex flex-col overflow-hidden rounded-xl border border-line bg-elevated transition-colors duration-300 hover:border-line-strong ${
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
                <h3 className="mt-3 text-title">
                  {/* The link's overlay makes the whole card clickable. */}
                  <Link href={`/work/${project.slug}/`} className="after:absolute after:inset-0 after:content-['']">
                    {project.title}
                  </Link>
                </h3>
                <p className={`mt-3 text-body text-grey ${wide ? "" : "flex-1"}`}>{project.summary}</p>
                <p className="mt-6 flex flex-wrap items-center gap-4">
                  <ProjectStatusBadge status={project.status} />
                  <span
                    aria-hidden
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-offwhite underline decoration-line-strong underline-offset-4 transition-colors group-hover:decoration-offwhite"
                  >
                    Read the full story
                    <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" strokeWidth={1.75} />
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
