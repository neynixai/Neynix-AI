import { LogoMark } from "@/components/logo";
import { ButtonLink } from "@/components/ui";

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden">
      <div className="container-page grid items-center gap-12 pb-16 pt-10 sm:pt-14 lg:min-h-[calc(100svh-4rem)] lg:grid-cols-[1.05fr_1fr] lg:gap-8 lg:pb-20 lg:pt-6">
        <div className="max-w-xl">
          <p className="eyebrow animate-rise">Independent AI engineering studio</p>
          <h1
            id="hero-title"
            className="mt-5 text-display animate-rise [animation-delay:80ms]"
          >
            Build what&rsquo;s next <span className="whitespace-nowrap">with AI.</span>
          </h1>
          <p className="mt-6 max-w-[34rem] text-lede text-pretty text-grey animate-rise [animation-delay:160ms]">
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
            className="eyebrow mt-12 flex flex-wrap gap-x-5 gap-y-2 animate-fade [animation-delay:400ms]"
          >
            {["AI engineering", "Automation", "Intelligent software"].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span aria-hidden className="size-1 bg-grey" />
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
      <svg viewBox="0 0 400 400" className="absolute inset-0 size-full text-offwhite" fill="none">
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
          className="w-full"
        />
      </div>

      <div className="absolute right-0 top-[24%] hidden border-l border-line-strong pl-3 text-xs leading-relaxed text-grey sm:block">
        Ideas
        <br />
        Intelligence
        <br />
        Impact
      </div>
      <span className="absolute bottom-[9%] right-[4%] text-xs tabular-nums text-grey">
        01
      </span>
    </div>
  );
}
