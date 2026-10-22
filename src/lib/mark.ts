/**
 * The NEYNIX AI mark: a soft "N" (a diagonal body over a leg, joined by a
 * fold) and a separate sphere.
 *
 * The shape is defined in 3D as tapered capsules blended with a smooth union
 * (see MARK_SHAPE, also used by the hero's WebGL render); the 2D paths below
 * are traced from it. brand/neynix-brand-board.webp is the visual reference.
 */

/** Full silhouette of the N (drawn behind). viewBox 0 0 100 88. */
export const MARK_UNION_PATH =
  "M 23.05 3.9 C 14.61 4.49, 7.87 10.8, 6.65 19.23 C 6.11 23.03, 6.71 26.64, 8.72 31.6 C 9.03 32.38, 9.54 33.64, 9.85 34.4 C 11.22 37.78, 11.77 40.05, 11.76 42.35 C 11.76 43.79, 11.57 44.86, 10.64 48.5 C 9.75 52.02, 9.43 53.05, 8.22 56.42 C 6.77 60.43, 6.3 61.45, 4.66 64.08 C 2.93 66.88, 2.35 68.83, 2.41 71.69 C 2.49 75.05, 3.74 77.99, 6.1 80.35 C 12.66 86.92, 23.79 84.46, 27.02 75.72 C 27.32 74.91, 27.53 74, 27.77 72.44 C 28.22 69.52, 28.52 68.43, 29.87 64.8 C 30.59 62.89, 30.77 62.37, 31.27 60.81 C 31.81 59.14, 32.35 58.14, 33.12 57.37 C 34.47 56.03, 36.15 56.15, 38.83 57.77 C 39.88 58.4, 43.93 61.18, 45 61.99 C 46.39 63.06, 47.09 63.73, 55.4 72.02 C 60.01 76.62, 63.94 80.53, 64.15 80.71 C 68.05 84.12, 73.16 85.64, 78.2 84.9 C 87.87 83.47, 94.46 74.41, 92.84 64.78 C 92.08 60.23, 89.53 56.18, 85.72 53.46 C 84.91 52.89, 84.74 52.79, 74.33 47.1 C 62.51 40.65, 63.14 41.01, 61.53 39.83 C 58.36 37.51, 54.66 34.18, 51.89 31.15 C 48.61 27.56, 48.25 27.05, 46.41 23.3 C 43.94 18.28, 42.49 15.8, 40.17 12.55 C 38.46 10.15, 36.8 8.5, 34.65 7.07 C 31.21 4.77, 27 3.62, 23.05 3.9";

/** The diagonal body alone (drawn in front, so the fold reads). */
export const MARK_BODY_PATH =
  "M 23.07 3.9 C 17.58 4.24, 12.45 7.22, 9.42 11.85 C 4.56 19.29, 5.93 29.12, 12.65 34.93 C 12.91 35.15, 15.87 37.45, 19.23 40.03 C 25.9 45.16, 25.82 45.1, 26.65 45.82 C 27.78 46.81, 28.8 47.89, 31.2 50.6 C 34.4 54.23, 37.07 56.55, 41.41 59.48 C 44.18 61.35, 45.06 61.99, 46.33 63.07 C 46.76 63.44, 50.2 66.84, 55.4 72.02 C 60.01 76.62, 63.94 80.53, 64.15 80.71 C 68.05 84.12, 73.16 85.64, 78.2 84.9 C 87.87 83.47, 94.46 74.41, 92.84 64.78 C 92.08 60.23, 89.53 56.18, 85.72 53.46 C 84.91 52.89, 84.74 52.79, 74.33 47.1 C 62.51 40.65, 63.14 41.01, 61.53 39.83 C 60.3 38.93, 57.51 36.63, 56.05 35.32 C 53.48 33.01, 49.79 28.99, 48.14 26.7 C 47.61 25.96, 47.52 25.82, 43.05 18.5 C 40.84 14.88, 38.9 11.72, 38.72 11.47 C 35.18 6.38, 29.28 3.53, 23.07 3.9";

export const MARK_SPHERE = { cx: 84.53, cy: 15.58, r: 14.92 };

/**
 * 3D definition in mark units (about -1..1, y up). Each chain is a run of
 * round cones through [x, y, z, radius] points; chains blend with smooth-min k.
 */
export const MARK_SHAPE = {
  body: [
    [-0.482, 0.41, 0.08, 0.32],
    [-0.105, -0.01, 0.14, 0.217],
    [0.45, -0.425, 0.08, 0.315],
  ],
  leg: [
    [-0.428, 0.333, -0.08, 0.265],
    [-0.545, -0.215, -0.24, 0.17],
    [-0.647, -0.492, -0.14, 0.23],
  ],
  sphere: [0.61, 0.518, 0, 0.27],
  k: 0.14,
} as const;

/**
 * The mark as an SVG string. `id` prefixes the gradient ids, so give each
 * inline copy on a page its own.
 */
export function markSvg(id = "nx", attrs = "") {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 88" ${attrs}>
  <defs>
    <linearGradient id="${id}-back" x1="0.02" y1="0.45" x2="0.32" y2="0.95">
      <stop offset="0" stop-color="#d7ff64"/>
      <stop offset="0.4" stop-color="#5d6352"/>
      <stop offset="0.75" stop-color="#a7a99f"/>
      <stop offset="1" stop-color="#f0f0ea"/>
    </linearGradient>
    <linearGradient id="${id}-front" x1="0.9" y1="0.15" x2="0.1" y2="0.75">
      <stop offset="0" stop-color="#ffffff"/>
      <stop offset="0.6" stop-color="#dcddd6"/>
      <stop offset="1" stop-color="#a9aba2"/>
    </linearGradient>
    <radialGradient id="${id}-rim" cx="0.08" cy="0.42" r="0.22">
      <stop offset="0" stop-color="#d7ff64" stop-opacity="0.55"/>
      <stop offset="1" stop-color="#d7ff64" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="${id}-sphere" x1="0.85" y1="0.1" x2="0.2" y2="0.95">
      <stop offset="0" stop-color="#d7ff64"/>
      <stop offset="0.5" stop-color="#a3ad8a"/>
      <stop offset="1" stop-color="#3b3d37"/>
    </linearGradient>
    <clipPath id="${id}-clip"><path d="${MARK_UNION_PATH}"/></clipPath>
    <filter id="${id}-shadow" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="2.2"/></filter>
  </defs>
  <path d="${MARK_UNION_PATH}" fill="url(#${id}-back)"/>
  <g clip-path="url(#${id}-clip)"><path d="${MARK_BODY_PATH}" fill="#000" fill-opacity="0.6" transform="translate(-1.5 3)" filter="url(#${id}-shadow)"/></g>
  <path d="${MARK_BODY_PATH}" fill="url(#${id}-front)"/>
  <path d="${MARK_BODY_PATH}" fill="url(#${id}-rim)"/>
  <circle cx="${MARK_SPHERE.cx}" cy="${MARK_SPHERE.cy}" r="${MARK_SPHERE.r}" fill="url(#${id}-sphere)"/>
</svg>`;
}

let markCount = 0;

/** A fresh gradient-id prefix for each inline copy of the mark on a page. */
export function nextMarkId() {
  markCount += 1;
  return `nx${markCount}`;
}
