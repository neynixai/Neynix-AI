import { LogoMark } from "@/components/logo";
import { ButtonLink } from "@/components/ui";

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden">
      {/* Soft ambient light — no colour, just depth. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_55%_at_75%_35%,#ffffff_0%,rgb(242_242_246/0.6)_55%,transparent_100%)]"
      />

      <div className="container-page grid items-center gap-12 pb-16 pt-10 sm:pt-14 lg:min-h-[calc(100svh-4rem)] lg:grid-cols-[1.05fr_1fr] lg:gap-8 lg:pb-20 lg:pt-6">
        <div className="max-w-xl">
          <p className="eyebrow animate-rise">Independent AI engineering studio</p>
          <h1
            id="hero-title"
            className="mt-5 text-display font-semibold animate-rise [animation-delay:80ms]"
          >
            Build what&rsquo;s next <span className="whitespace-nowrap">with AI.</span>
          </h1>
          <p className="mt-6 max-w-[34rem] text-lede text-pretty text-muted animate-rise [animation-delay:160ms]">
            NEYNIX AI builds intelligent applications, AI agents, and custom software that help turn
            complex ideas into practical solutions.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row animate-rise [animation-delay:240ms]">
            <ButtonLink href="#contact" arrow>
              Discuss a project
            </ButtonLink>
            <ButtonLink href="#services" variant="secondary">
              Explore our capabilities
            </ButtonLink>
          </div>
          <ul
            aria-label="Focus areas"
            className="eyebrow mt-12 flex flex-wrap gap-x-5 gap-y-2 !text-[0.625rem] sm:!text-[0.6875rem] animate-fade [animation-delay:400ms]"
          >
            {["AI engineering", "Automation", "Intelligent software"].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span aria-hidden className="size-1 bg-ink/40" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <HeroVisual />
      </div>
    </section>
  );
}

function HeroVisual() {
  return (
    <div
      aria-hidden
      className="relative mx-auto aspect-square w-full max-w-[22rem] animate-fade [animation-delay:150ms] sm:max-w-[30rem] lg:max-w-[36rem]"
    >
      {/* Architectural frame: hairline grid, fading toward the edges. */}
      <div className="bg-grid absolute inset-[6%] [mask-image:radial-gradient(closest-side,black_55%,transparent_100%)]" />
      <svg viewBox="0 0 400 400" className="absolute inset-0 size-full text-ink" fill="none">
        <circle cx="200" cy="200" r="150" stroke="currentColor" strokeOpacity="0.07" />
        <circle cx="200" cy="200" r="190" stroke="currentColor" strokeOpacity="0.05" strokeDasharray="2 6" />
        <line x1="10" y1="200" x2="44" y2="200" stroke="currentColor" strokeOpacity="0.35" />
        <circle cx="10" cy="200" r="2" fill="currentColor" />
        <circle cx="34" cy="200" r="1.5" fill="currentColor" fillOpacity="0.5" />
        <line x1="300" y1="352" x2="372" y2="352" stroke="currentColor" strokeOpacity="0.25" />
      </svg>

      <div className="absolute inset-y-[16%] left-[12%] right-[24%] flex items-center justify-center">
        <LogoMark
          priority
          sizes="(min-width: 1024px) 400px, (min-width: 640px) 330px, 240px"
          className="w-full drop-shadow-[0_30px_40px_rgb(17_19_24/0.12)]"
        />
      </div>

      <div className="absolute right-0 top-[24%] hidden border-l border-ink/20 pl-3 font-mono text-[0.625rem] leading-relaxed tracking-[0.2em] text-muted sm:block">
        IDEAS
        <br />
        INTELLIGENCE
        <br />
        IMPACT
      </div>
      <span className="absolute bottom-[9%] right-[4%] font-mono text-[0.625rem] tracking-[0.2em] text-muted">
        01
      </span>
    </div>
  );
}
