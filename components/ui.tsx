import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "inverse" | "ghost-inverse";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-ink text-white hover:bg-graphite border border-ink",
  secondary: "bg-white text-ink border border-line-strong hover:border-ink",
  inverse: "bg-white text-ink border border-white hover:bg-surface",
  "ghost-inverse": "bg-transparent text-white border border-white/25 hover:border-white/70",
};

export function ButtonLink({
  href,
  children,
  variant = "primary",
  arrow = false,
  className = "",
  ...rest
}: {
  href: string;
  children: ReactNode;
  variant?: ButtonVariant;
  arrow?: boolean;
  className?: string;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "className" | "children">) {
  return (
    <a
      href={href}
      className={`group inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-5 text-sm font-medium transition-colors duration-200 ${variants[variant]} ${className}`}
      {...rest}
    >
      {children}
      {arrow && (
        <ArrowRight
          aria-hidden
          className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
          strokeWidth={1.75}
        />
      )}
    </a>
  );
}

/** Eyebrow + heading + optional lede, with an optional index label on the right. */
export function SectionHeader({
  eyebrow,
  title,
  lede,
  index,
  id,
  tone = "dark",
}: {
  eyebrow: string;
  title: ReactNode;
  lede?: ReactNode;
  index?: string;
  id: string;
  tone?: "dark" | "light";
}) {
  return (
    <div className="reveal flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        <p className={`eyebrow ${tone === "light" ? "!text-silver" : ""}`}>{eyebrow}</p>
        <h2 id={id} className="mt-4 text-heading font-semibold text-balance">
          {title}
        </h2>
        {lede && (
          <p className={`mt-5 max-w-xl text-lede text-pretty ${tone === "light" ? "text-silver" : "text-muted"}`}>
            {lede}
          </p>
        )}
      </div>
      {index && (
        <p aria-hidden className="eyebrow hidden shrink-0 md:block">
          {index}
        </p>
      )}
    </div>
  );
}
