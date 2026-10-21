import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ProjectStatusBadge } from "@/components/project-status";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ButtonLink } from "@/components/ui";
import { siteConfig } from "@/config/site";
import { getProject, projects } from "@/lib/projects";

type Props = { params: Promise<{ slug: string }> };

// Static export: only the projects in lib/projects.ts get a page.
export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = getProject((await params).slug);
  if (!project) return {};
  const title = `${project.title} | ${siteConfig.name}`;
  const url = siteConfig.url ? `${siteConfig.url}/work/${project.slug}/` : undefined;
  return {
    title,
    description: project.summary,
    ...(url ? { alternates: { canonical: url } } : {}),
    openGraph: {
      type: "article",
      siteName: siteConfig.name,
      title,
      description: project.summary,
      ...(url ? { url } : {}),
      images: [{ url: project.image.src, alt: project.imageAlt }],
    },
    twitter: { card: "summary_large_image", title, description: project.summary },
  };
}

export default async function ProjectPage({ params }: Props) {
  const project = getProject((await params).slug);
  if (!project) notFound();

  return (
    <>
      <div id="top" />
      <SiteHeader />
      <main id="main">
        <article>
          <header className="container-page pb-14 pt-10 sm:pt-14">
            <Link
              href="/#work"
              className="inline-flex items-center gap-2 text-sm font-medium text-grey transition-colors hover:text-offwhite"
            >
              <ArrowLeft aria-hidden className="size-4" strokeWidth={1.75} />
              All work
            </Link>

            <div className="mt-10 max-w-3xl">
              <p className="eyebrow animate-rise">{project.category}</p>
              <h1 className="mt-4 text-display animate-rise [animation-delay:80ms]">{project.title}</h1>
              <p className="mt-6 max-w-2xl text-lede text-pretty text-grey animate-rise [animation-delay:160ms]">
                {project.tagline}
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4 animate-rise [animation-delay:240ms]">
                <ProjectStatusBadge status={project.status} />
                <ButtonLink href="/#contact" arrow className="!min-h-9 !px-4">
                  Discuss a project like this
                </ButtonLink>
              </div>
            </div>

            <div className="relative mt-14 aspect-[16/10] overflow-hidden rounded-xl border border-line bg-elevated animate-fade [animation-delay:300ms]">
              <Image
                src={project.image}
                alt={project.imageAlt}
                fill
                priority
                sizes="(min-width: 1216px) 1136px, 100vw"
                className="object-cover object-left-top"
              />
            </div>
          </header>

          <Section id="why" eyebrow="Why it exists" title="The problem" tone="elevated">
            <p className="max-w-2xl text-lede text-pretty text-grey">{project.why.intro}</p>
            <PointList points={project.why.points} columns={3} />
          </Section>

          <Section id="what" eyebrow="What it is" title={`What ${project.title} does`}>
            <p className="max-w-2xl text-lede text-pretty text-grey">{project.what.intro}</p>
            <PointList points={project.what.features} columns={3} />
          </Section>

          <Section id="who" eyebrow="Who it’s for" title="Built for" tone="elevated">
            <PointList points={project.audiences} columns={2} />
          </Section>

          <Section id="how" eyebrow="How it’s built" title="The principles behind it">
            <PointList points={project.principles} columns={2} />
          </Section>

          <Section id="progress" eyebrow="Where it stands" title="Today and next" tone="elevated">
            <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
              <div className="reveal">
                <ProjectStatusBadge status={project.status} />
                <p className="mt-5 text-body text-offwhite/80">{project.progress.now}</p>
              </div>
              <div className="reveal">
                <h3 className="text-base">Coming next</h3>
                <ul className="mt-4 space-y-3">
                  {project.progress.next.map((item) => (
                    <li key={item} className="flex gap-3 text-body text-grey">
                      <span aria-hidden className="mt-[0.7em] size-1 shrink-0 bg-lime" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            {project.note && <p className="mt-12 max-w-2xl text-xs text-grey">{project.note}</p>}
          </Section>

          <section aria-labelledby="project-cta-title" className="section-pad border-t border-line">
            <div className="container-page reveal flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
              <div className="max-w-xl">
                <p className="eyebrow">Have an idea worth building?</p>
                <h2 id="project-cta-title" className="mt-4 text-heading">
                  Let&rsquo;s build yours next.
                </h2>
                <p className="mt-5 text-lede text-pretty text-grey">
                  From a first prototype to a product people rely on, {siteConfig.name} turns ideas like this
                  into working software.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <ButtonLink href="/#contact" arrow>
                  Discuss a project
                </ButtonLink>
                <ButtonLink href="/#work" variant="secondary">
                  See all work
                </ButtonLink>
              </div>
            </div>
          </section>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}

function Section({
  id,
  eyebrow,
  title,
  tone = "base",
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  tone?: "base" | "elevated";
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={`section-pad border-t border-line ${tone === "elevated" ? "bg-elevated" : "bg-obsidian"}`}
    >
      <div className="container-page">
        <div className="reveal">
          <p className="eyebrow">{eyebrow}</p>
          <h2 id={`${id}-title`} className="mt-4 text-heading">
            {title}
          </h2>
        </div>
        <div className="mt-8">{children}</div>
      </div>
    </section>
  );
}

function PointList({ points, columns }: { points: { title: string; body: string }[]; columns: 2 | 3 }) {
  return (
    <ul className={`mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2 ${columns === 3 ? "lg:grid-cols-3" : ""}`}>
      {points.map((point) => (
        <li key={point.title} className="reveal border-t border-line pt-6">
          <h3 className="text-title">{point.title}</h3>
          <p className="mt-3 text-body text-grey">{point.body}</p>
        </li>
      ))}
    </ul>
  );
}
