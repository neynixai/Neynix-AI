import { createRenderer, prefersReducedMotion, runWhenVisible } from "@/scripts/webgl";

/**
 * Two flowing ribbons shaded as curved satin surfaces, each with a lime glow
 * along its crest — the wave from the brand board, in slow motion.
 */
const FRAGMENT = /* glsl */ `
precision highp float;
uniform vec2 uRes;
uniform float uTime;

const vec3 LIME = vec3(0.843, 1.0, 0.392);
const vec3 BG = vec3(0.067, 0.075, 0.063);

// Crest height of a ribbon across the canvas, and its slope.
vec2 crest(float x, float t, float base, float rise, float phase) {
  float h = base + rise * x
    + 0.07 * sin(x * 3.1 + t * 0.35 + phase)
    + 0.035 * sin(x * 6.3 - t * 0.5 + phase * 1.7)
    + 0.06 * sin(x * 1.4 - t * 0.21);
  float d = rise
    + 0.07 * 3.1 * cos(x * 3.1 + t * 0.35 + phase)
    + 0.035 * 6.3 * cos(x * 6.3 - t * 0.5 + phase * 1.7)
    + 0.06 * 1.4 * cos(x * 1.4 - t * 0.21);
  return vec2(h, d);
}

// Colour (rgb) and coverage (a) of one ribbon at this pixel.
vec4 ribbon(vec2 uv, float t, float base, float rise, float phase, float bright) {
  vec2 c = crest(uv.x, t, base, rise, phase);
  float px = 1.5 / uRes.y;
  float below = c.x - uv.y;

  // The surface turns away from the light as it falls below the crest.
  vec2 n = normalize(vec2(-c.y, 1.0));
  float light = clamp(dot(n, normalize(vec2(-0.55, 0.85))), 0.0, 1.0);
  float depth = smoothstep(0.0, 0.3, below);
  vec3 surface = mix(vec3(0.66, 0.665, 0.65) * (0.3 + 0.7 * light), BG, depth) * bright;
  surface += LIME * exp(-below * 38.0) * 0.55 * (0.5 + 0.5 * light);

  float inside = smoothstep(-px, px, below);
  float glow = exp(-abs(below) * 160.0) * 0.9 + exp(-max(-below, 0.0) * 22.0) * 0.12;
  vec3 col = surface * inside + LIME * glow * (1.0 - inside * 0.6);
  return vec4(col, max(inside, glow));
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  float t = uTime;
  vec4 back = ribbon(uv, t * 0.8, 0.18, 0.5, 2.0, 0.55);
  vec4 front = ribbon(uv, t, 0.02, 0.42, 0.0, 1.0);
  vec3 col = back.rgb;
  float a = back.a;
  col = front.rgb + col * (1.0 - front.a);
  a = front.a + a * (1.0 - front.a);
  gl_FragColor = vec4(col, a);
}
`;

export function mountWave3D(canvas: HTMLCanvasElement, onReady: () => void) {
  const renderer = createRenderer(canvas, FRAGMENT, { maxDpr: 1.25 });
  if (!renderer) return;

  const still = prefersReducedMotion();
  const start = performance.now();
  let first = true;
  const frame = (now: number) => {
    renderer.draw({ uTime: still ? 4 : (now - start) / 1000 });
    if (first) {
      first = false;
      onReady();
    }
  };

  if (still) {
    renderer.onResize(() => frame(performance.now()));
    frame(performance.now());
  } else {
    runWhenVisible(canvas, frame);
  }
}
