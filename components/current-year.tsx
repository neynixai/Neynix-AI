"use client";

/** Rendered in the browser so the year stays current on a statically built page. */
export function CurrentYear() {
  return <span suppressHydrationWarning>{new Date().getFullYear()}</span>;
}
