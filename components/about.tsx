import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import founderPortrait from "@/public/brand/founder-nishaanth.webp";
import { GITHUB_URL, LINKEDIN_URL, siteConfig } from "@/config/site";

const parts = [
  {
    key: "NEY",
    title: "Determination",
    body: "The never-give-up attitude inspired by Neymar — creativity, confidence, and the will to keep going.",
  },
  {
    key: "NI",
    title: "Ownership",
    body: "Nishaanth, the founder behind the vision, and the ambition to build something of your own.",
  },
  {
    key: "X",
    title: "The X factor",
    body: "The unique edge that drives creativity, experimentation, and problem-solving.",
  },
];

export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="section-pad border-t border-line bg-white">
      <div className="container-page grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div className="reveal">
          <p className="eyebrow">The story behind the name</p>
          <h2 id="about-title" className="mt-4 text-heading font-semibold text-balance">
            More than a name. A mindset.
          </h2>
          <p className="mt-6 max-w-md text-lede text-pretty text-muted">
            NEYNIX brings together three ideas: the determination to keep going, the ambition to build something
            of your own, and the X factor that comes from thinking differently.
          </p>

          <FounderCard />
        </div>

        <div>
          <ul className="grid border-y border-line sm:grid-cols-3 sm:divide-x sm:divide-line">
            {parts.map((part) => (
              <li
                key={part.key}
                className="reveal flex gap-6 border-b border-line py-7 last:border-b-0 sm:flex-col sm:gap-0 sm:border-b-0 sm:px-6 sm:py-8 sm:first:pl-0 sm:last:pr-0"
              >
                <span
                  aria-hidden
                  className="w-20 shrink-0 text-[clamp(2.75rem,2rem+2.5vw,4rem)] font-semibold leading-none tracking-[-0.05em] sm:w-auto"
                >
                  {part.key}
                </span>
                <div className="sm:mt-8">
                  <h3 className="text-sm font-semibold">
                    <span className="sr-only">{part.key} — </span>
                    {part.title}
                  </h3>
                  <p className="mt-2 text-[0.8125rem] leading-relaxed text-muted">{part.body}</p>
                </div>
              </li>
            ))}
          </ul>
          <p className="reveal mt-8 max-w-xl text-[0.9375rem] leading-relaxed text-ink/80">
            Together, they represent the mindset behind NEYNIX AI: ambitious thinking, independent engineering,
            and the determination to turn ideas into useful technology.
          </p>
          <p className="mt-4 text-xs text-muted">
            The name is a personal tribute. NEYNIX AI is independent and not affiliated with or endorsed by
            Neymar.
          </p>
        </div>
      </div>
    </section>
  );
}

function FounderCard() {
  const links = [
    { label: "LinkedIn", href: LINKEDIN_URL },
    { label: "GitHub", href: GITHUB_URL },
  ].filter((link) => link.href);

  return (
    <figure className="mt-12 max-w-md border-t border-line pt-8">
      <figcaption className="eyebrow">Founder</figcaption>
      <div className="mt-5 flex items-end gap-5">
        <Image
          src={founderPortrait}
          alt={`Portrait of ${siteConfig.founder}, founder of ${siteConfig.name}`}
          sizes="128px"
          className="w-28 shrink-0 rounded-lg object-cover grayscale transition-[filter] duration-500 hover:grayscale-0 sm:w-32"
        />
        <div className="pb-1">
          <p className="text-xl font-semibold tracking-tight">{siteConfig.founder}</p>
          <p className="mt-1 text-sm text-muted">{siteConfig.founderTitle}</p>
        </div>
      </div>
      <div className="mt-6 space-y-3 text-sm leading-relaxed text-muted">
        <p>
          An AI engineer with two years of experience in product development. {siteConfig.founder} started{" "}
          {siteConfig.name} to help small businesses go digital and put new technology like AI to practical use.
        </p>
        <p>Every client works directly with {siteConfig.founder}, from the first conversation to the final review.</p>
      </div>
      {links.length > 0 && (
        <ul className="mt-5 flex gap-5 text-sm">
          {links.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-medium text-ink underline-offset-4 hover:underline"
              >
                {link.label}
                <ArrowUpRight aria-hidden className="size-3.5" strokeWidth={1.5} />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </figure>
  );
}
