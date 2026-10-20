import { CONTACT_EMAIL, CONTACT_FORM_ENDPOINT, LINKEDIN_URL } from "@/config/site";
import { ContactForm } from "@/components/contact-form";
import { LogoMark } from "@/components/logo";
import { ButtonLink } from "@/components/ui";

export function Contact() {
  const formEnabled = Boolean(CONTACT_FORM_ENDPOINT);

  // "Start a conversation" goes to the best channel that is actually configured.
  const primary = formEnabled
    ? { href: "#contact-form" }
    : CONTACT_EMAIL
      ? { href: `mailto:${CONTACT_EMAIL}` }
      : LINKEDIN_URL
        ? { href: LINKEDIN_URL, target: "_blank", rel: "noopener noreferrer" }
        : null;
  const showEmailButton = Boolean(CONTACT_EMAIL) && primary?.href !== `mailto:${CONTACT_EMAIL}`;

  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="relative isolate overflow-hidden border-t border-line bg-obsidian"
    >
      <ContourLines />

      <div className="container-page section-pad grid items-center gap-14 lg:grid-cols-[1.2fr_1fr]">
        <div className="reveal">
          <p className="eyebrow">Have an idea worth building?</p>
          <h2 id="contact-title" className="mt-4 text-heading">
            Let&rsquo;s make it real.
          </h2>
          <p className="mt-6 max-w-lg text-lede text-pretty text-grey">
            Have an AI idea, an automation challenge, or a software project in mind? Let&rsquo;s discuss what a
            practical solution could look like.
          </p>

          {(primary || showEmailButton) && (
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              {primary && (
                <ButtonLink arrow {...primary}>
                  Start a conversation
                </ButtonLink>
              )}
              {showEmailButton && (
                <ButtonLink variant="secondary" href={`mailto:${CONTACT_EMAIL}`}>
                  Email NEYNIX AI
                </ButtonLink>
              )}
            </div>
          )}

          {!primary && process.env.NODE_ENV !== "production" && (
            <p className="mt-9 max-w-lg rounded-md border border-dashed border-line-strong p-4 font-mono text-xs leading-relaxed text-grey">
              Dev note (hidden in production): no contact channel is configured. Set NEXT_PUBLIC_CONTACT_EMAIL,
              NEXT_PUBLIC_LINKEDIN_URL, or NEXT_PUBLIC_CONTACT_FORM_ENDPOINT in .env.local — see .env.example.
            </p>
          )}
        </div>

        <div aria-hidden className="hidden items-center justify-center gap-8 lg:flex">
          <LogoMark sizes="256px" className="w-64" />
          <p className="border-l border-line-strong pl-3 font-mono text-[0.625rem] leading-relaxed tracking-[0.12em] text-grey">
            IDEAS
            <br />
            ENGINEERING
            <br />
            IMPACT
          </p>
        </div>
      </div>

      {formEnabled && (
        <div id="contact-form" className="container-page pb-[clamp(4.5rem,3rem+6vw,8.5rem)]">
          <div className="grid gap-10 border-t border-line pt-14 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <h3 className="text-[1.5rem] leading-tight tracking-[-0.02em]">Tell us about your project</h3>
              <p className="mt-3 max-w-sm text-body text-grey">
                A few sentences is enough — the problem, who it&rsquo;s for, and any constraints you already know
                about.
              </p>
            </div>
            <ContactForm />
          </div>
        </div>
      )}
    </section>
  );
}

/** Soft topographic lines — a quiet nod to depth without generic AI imagery. */
function ContourLines() {
  const paths = Array.from({ length: 14 }, (_, i) => {
    const y = 250 + i * 18;
    const a = 40 + i * 6;
    return `M0 ${y} C 240 ${y - a}, 420 ${y + a * 0.6}, 640 ${y - a * 0.4} S 1000 ${y - a * 1.2}, 1200 ${y - a * 0.2}`;
  });
  return (
    <svg
      aria-hidden
      viewBox="0 0 1200 600"
      preserveAspectRatio="xMidYMid slice"
      className="pointer-events-none absolute inset-0 -z-10 size-full [mask-image:linear-gradient(to_right,transparent_10%,black_70%)]"
      fill="none"
      stroke="#f5f5f0"
    >
      {paths.map((d, i) => (
        <path key={i} d={d} strokeOpacity={0.03 + i * 0.006} />
      ))}
    </svg>
  );
}
