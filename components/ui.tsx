import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

type ButtonVariant = "primary" | "secondary";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-lime text-obsidian border border-lime hover:bg-lime-hover hover:border-lime-hover",
  secondary: "bg-transparent text-offwhite border border-line-strong hover:border-offwhite",
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
  // Site paths go through next/link so they pick up the GitHub Pages basePath.
  const Anchor = href.startsWith("/") ? Link : "a";
  return (
    <Anchor
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
    </Anchor>
  );
}

/** Eyebrow + heading + optional lede, with an optional index label on the right. */
export function SectionHeader({
  eyebrow,
  title,
  lede,
  index,
  id,
}: {
  eyebrow: string;
  title: ReactNode;
  lede?: ReactNode;
  index?: string;
  id: string;
}) {
  return (
    <div className="reveal flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        <p className="eyebrow">{eyebrow}</p>
        <h2 id={id} className="mt-4 text-heading">
          {title}
        </h2>
        {lede && (
          <p className="mt-5 max-w-xl text-lede text-pretty text-grey">
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
