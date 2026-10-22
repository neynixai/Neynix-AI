const base = import.meta.env.BASE_URL.replace(/\/$/, "");

/**
 * Prefixes a site path ("/work/ca-mode/", "/#contact") with the deploy base
 * path, so links keep working when GitHub Pages serves the site from /<repo>.
 */
export function href(path: string): string {
  return path.startsWith("/") ? `${base}${path}` : path;
}
