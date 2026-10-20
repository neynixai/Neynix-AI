import Image from "next/image";
import markDark from "@/public/brand/neynix-mark.png";
import markLight from "@/public/brand/neynix-mark-light.png";
import { siteConfig } from "@/config/site";

type Tone = "dark" | "light";

/** The N symbol. `tone="light"` (default) is the reversed mark for the dark site; `"dark"` is the original. */
export function LogoMark({
  tone = "light",
  className,
  priority,
  sizes = "40px",
  alt = "",
}: {
  tone?: Tone;
  className?: string;
  priority?: boolean;
  sizes?: string;
  alt?: string;
}) {
  return (
    <Image
      src={tone === "light" ? markLight : markDark}
      alt={alt}
      className={className}
      priority={priority}
      sizes={sizes}
      // Height follows the asset's intrinsic ratio so the mark is never distorted.
      style={{ height: "auto" }}
    />
  );
}

/** Symbol + wordmark lockup used in the navigation and footer. */
export function Logo({ tone = "light", className = "" }: { tone?: Tone; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark tone={tone} className="w-[26px]" priority sizes="26px" />
      <span
        className={`font-display text-[0.95rem] font-semibold tracking-[0.06em] ${tone === "light" ? "text-offwhite" : "text-obsidian"}`}
      >
        {siteConfig.name}
      </span>
    </span>
  );
}
