import { MARK_SHAPE } from "@/lib/mark";
import { createRenderer, prefersReducedMotion, runWhenVisible } from "@/scripts/webgl";

/**
 * Renders the NEYNIX mark in 3D by ray-marching its signed distance field:
 * round cones blended with a smooth union (MARK_SHAPE), lit as satin silver
 * with the brand lime as rim and fill light. The mark floats, breathes and
 * leans toward the pointer.
 */

const v = (n: readonly number[]) => `vec4(${n.map((x) => x.toFixed(3)).join(", ")})`;
const { body, leg, sphere, k } = MARK_SHAPE;

const FRAGMENT = /* glsl */ `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uTilt;
uniform float uShift;

const vec4 B0 = ${v(body[0])};
const vec4 B1 = ${v(body[1])};
const vec4 B2 = ${v(body[2])};
const vec4 L0 = ${v(leg[0])};
const vec4 L1 = ${v(leg[1])};
const vec4 L2 = ${v(leg[2])};
const vec4 S0 = ${v(sphere)};
const float K = ${k.toFixed(3)};
const vec3 LIME = vec3(0.843, 1.0, 0.392);
// Depth is squashed a little so the mark reads as a soft, pillowy form.
const float FLAT = 1.9;

mat3 rotY(float a) { float c = cos(a), s = sin(a); return mat3(c, 0.0, -s, 0.0, 1.0, 0.0, s, 0.0, c); }
mat3 rotX(float a) { float c = cos(a), s = sin(a); return mat3(1.0, 0.0, 0.0, 0.0, c, s, 0.0, -s, c); }

float smin(float a, float b, float k) {
  float h = max(k - abs(a - b), 0.0) / k;
  return min(a, b) - h * h * k * 0.25;
}

// Round cone between spheres (a, r1) and (b, r2) — Inigo Quilez.
float roundCone(vec3 p, vec3 a, vec3 b, float r1, float r2) {
  vec3 ba = b - a;
  float l2 = dot(ba, ba);
  float rr = r1 - r2;
  float a2 = l2 - rr * rr;
  float il2 = 1.0 / l2;
  vec3 pa = p - a;
  float y = dot(pa, ba);
  float z = y - l2;
  vec3 xv = pa * l2 - ba * y;
  float x2 = dot(xv, xv);
  float y2 = y * y * l2;
  float z2 = z * z * l2;
  float kk = sign(rr) * rr * rr * x2;
  if (sign(z) * a2 * z2 > kk) return sqrt(x2 + z2) * il2 - r2;
  if (sign(y) * a2 * y2 < kk) return sqrt(x2 + y2) * il2 - r1;
  return (sqrt(x2 * a2 * il2) + y * rr) * il2 - r1;
}

mat3 uRot;
vec3 uSphere;
float uBreath;

// x: distance, y: material (0 = N, 1 = sphere)
vec2 map(vec3 p) {
  vec3 q = uRot * p;
  vec3 f = vec3(q.xy, q.z * FLAT);
  float neck = B1.w + uBreath;
  float b = smin(roundCone(f, B0.xyz, B1.xyz, B0.w, neck), roundCone(f, B1.xyz, B2.xyz, neck, B2.w), K);
  float l = smin(roundCone(f, L0.xyz, L1.xyz, L0.w, L1.w), roundCone(f, L1.xyz, L2.xyz, L1.w, L2.w), K);
  float n = smin(b, l, K) / FLAT;
  float s = length(q - uSphere) - S0.w;
  return s < n ? vec2(s, 1.0) : vec2(n, 0.0);
}

vec3 normalAt(vec3 p) {
  const vec2 e = vec2(0.0015, -0.0015);
  return normalize(
    e.xyy * map(p + e.xyy).x + e.yyx * map(p + e.yyx).x +
    e.yxy * map(p + e.yxy).x + e.xxx * map(p + e.xxx).x);
}

float occlusion(vec3 p, vec3 n) {
  float o = 0.0, w = 1.0;
  for (int i = 1; i <= 5; i++) {
    float h = 0.03 * float(i);
    o += w * (h - map(p + n * h).x);
    w *= 0.7;
  }
  return clamp(1.0 - 2.2 * o, 0.0, 1.0);
}

void main() {
  vec2 uv = (gl_FragCoord.xy * 2.0 - uRes) / min(uRes.x, uRes.y);
  uv.x += uShift; // sit left of centre, clear of the hero's side labels
  vec3 ro = vec3(0.0, 0.0, 4.0);
  vec3 rd = normalize(vec3(uv, -3.0));

  // Pose: a slow sway plus the pointer tilt.
  float t = uTime;
  uRot = rotX(0.12 * sin(t * 0.31) - uTilt.y * 0.35) * rotY(0.32 * sin(t * 0.23) + uTilt.x * 0.5);
  uSphere = S0.xyz + vec3(0.03 * sin(t * 0.7), 0.04 * sin(t * 0.9), 0.08 * sin(t * 0.5));
  uBreath = 0.012 * sin(t * 1.1);
  ro.y += 0.03 * sin(t * 0.6);

  // Skip pixels whose ray misses the mark's bounding sphere.
  float bR = 1.25;
  float bb = dot(ro, rd);
  float disc = bb * bb - dot(ro, ro) + bR * bR;
  if (disc < 0.0) { gl_FragColor = vec4(0.0); return; }
  float tt = max(-bb - sqrt(disc), 0.0);
  float tMax = -bb + sqrt(disc);

  float px = 2.0 / min(uRes.x, uRes.y) / 3.0; // ray spread per pixel at distance 1
  float edge = 1e3, edgeT = tt;
  vec2 hit = vec2(-1.0);
  for (int i = 0; i < 96; i++) {
    vec3 p = ro + rd * tt;
    vec2 h = map(p);
    float e = h.x / (px * tt);
    if (e < edge) { edge = e; edgeT = tt; }
    if (h.x < 0.0008 * tt) { hit = vec2(tt, h.y); break; }
    tt += h.x * 0.9;
    if (tt > tMax) break;
  }

  // Rays that only graze the mark shade its closest point at partial
  // coverage, which anti-aliases the silhouette.
  float alpha = 1.0;
  if (hit.x < 0.0) {
    alpha = 1.0 - smoothstep(0.0, 1.25, edge);
    if (alpha <= 0.0) { gl_FragColor = vec4(0.0); return; }
    hit = vec2(edgeT, map(ro + rd * edgeT).y);
  }

  vec3 p = ro + rd * hit.x;
  vec3 n = normalAt(p);
  vec3 nl = uRot * n; // normal in the mark's own frame, for lights that move with it
  vec3 v = -rd;
  float ao = occlusion(p, n);

  vec3 key = normalize(vec3(0.45, 0.85, 0.55));
  float wrap = pow(clamp(dot(n, key) * 0.5 + 0.5, 0.0, 1.0), 1.6);
  float spec = pow(max(dot(reflect(-key, n), v), 0.0), 28.0);
  float fres = pow(1.0 - max(dot(n, v), 0.0), 3.0);

  vec3 col;
  if (hit.y < 0.5) {
    // Satin silver, lime light from the lower left, glowing along the rim.
    vec3 base = vec3(0.86, 0.865, 0.85);
    vec3 limeDir = normalize(vec3(-0.85, -0.35, 0.35));
    float lime = pow(max(dot(nl, limeDir), 0.0), 1.8);
    col = base * (0.1 + 0.9 * wrap) * ao;
    col += LIME * lime * 0.55 * (0.4 + 0.6 * ao);
    col += LIME * fres * smoothstep(0.2, -0.6, nl.x) * 0.5;
    col += vec3(1.0) * spec * 0.25 * ao;
  } else {
    // The sphere: lime on its upper right, falling to graphite.
    vec3 sDir = normalize(vec3(0.7, 0.7, 0.35));
    float d = clamp(dot(nl, sDir) * 0.5 + 0.5, 0.0, 1.0);
    col = mix(vec3(0.16, 0.17, 0.15), LIME, smoothstep(0.35, 1.0, d));
    col = mix(col, vec3(0.62, 0.64, 0.58), 0.25 * wrap);
    col += LIME * fres * 0.35;
    col += vec3(1.0) * spec * 0.15;
  }

  // Premultiplied alpha over the page background.
  gl_FragColor = vec4(col * alpha, alpha);
}
`;

export function mountMark3D(canvas: HTMLCanvasElement, onReady: () => void) {
  const renderer = createRenderer(canvas, FRAGMENT, { maxDpr: 1.75 });
  if (!renderer) return;

  const still = prefersReducedMotion();
  const tilt = { x: 0, y: 0, tx: 0, ty: 0 };
  const start = performance.now();

  if (!still) {
    // Lean toward the pointer anywhere over the hero.
    const area = canvas.closest("section") ?? document.body;
    area.addEventListener("pointermove", (e) => {
      if (e.pointerType !== "mouse") return;
      const r = canvas.getBoundingClientRect();
      tilt.tx = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / (r.width * 0.9)));
      tilt.ty = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / (r.height * 0.9)));
    });
    area.addEventListener("pointerleave", () => {
      tilt.tx = 0;
      tilt.ty = 0;
    });
  }

  // The hero's side labels only show from the sm breakpoint.
  const labels = window.matchMedia("(min-width: 640px)");

  let first = true;
  const frame = (now: number) => {
    tilt.x += (tilt.tx - tilt.x) * 0.06;
    tilt.y += (tilt.ty - tilt.y) * 0.06;
    renderer.draw({
      uTime: still ? 2.2 : (now - start) / 1000,
      uTilt: [tilt.x, tilt.y],
      uShift: labels.matches ? 0.16 : 0,
    });
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
