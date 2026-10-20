"use client";

import { Menu, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Logo } from "@/components/logo";
import { ButtonLink } from "@/components/ui";
import { navLinks } from "@/lib/content";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const close = useCallback((restoreFocus: boolean) => {
    setOpen(false);
    if (restoreFocus) toggleRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    panelRef.current?.querySelector<HTMLElement>("a")?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close(true);
    };
    const desktop = window.matchMedia("(min-width: 768px)");
    const onBreakpoint = () => desktop.matches && close(false);

    window.addEventListener("keydown", onKey);
    desktop.addEventListener("change", onBreakpoint);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      desktop.removeEventListener("change", onBreakpoint);
    };
  }, [open, close]);

  // No backdrop-filter while the menu is open: it would become the containing
  // block for the fixed menu panel and collapse it to the header's height.
  const surface = open
    ? "border-line bg-obsidian"
    : scrolled
      ? "border-line bg-obsidian/85 backdrop-blur-md"
      : "border-transparent bg-transparent";

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-[background-color,border-color,backdrop-filter] duration-300 ${surface}`}
    >
      <div className="container-page flex h-16 items-center justify-between gap-6">
        <a href="#top" aria-label="NEYNIX AI — back to top" className="rounded-sm">
          <Logo />
        </a>

        <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
          <ul className="flex items-center gap-7">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="text-sm font-medium text-grey transition-colors hover:text-offwhite">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <ButtonLink href="#contact" arrow className="!min-h-9 !px-4">
            Discuss a project
          </ButtonLink>
        </nav>

        <button
          ref={toggleRef}
          type="button"
          className="-mr-2 inline-flex size-11 items-center justify-center rounded-md text-offwhite md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-5" strokeWidth={1.75} /> : <Menu className="size-5" strokeWidth={1.75} />}
        </button>
      </div>

      <div
        id="mobile-menu"
        ref={panelRef}
        hidden={!open}
        className="fixed inset-x-0 top-16 bottom-0 overflow-y-auto border-t border-line bg-obsidian md:hidden"
      >
        <nav aria-label="Mobile" className="container-page flex min-h-full flex-col pb-10 pt-4">
          <ul className="divide-y divide-line">
            {navLinks.map((link, i) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => close(false)}
                  className="flex items-baseline justify-between py-5 text-xl font-medium"
                >
                  {link.label}
                  <span className="text-xs tabular-nums text-grey">0{i + 1}</span>
                </a>
              </li>
            ))}
          </ul>
          <ButtonLink href="#contact" arrow className="mt-8 w-full" onClick={() => close(false)}>
            Discuss a project
          </ButtonLink>
        </nav>
      </div>
    </header>
  );
}
