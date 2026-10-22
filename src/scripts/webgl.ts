/** Minimal WebGL plumbing for the site's full-canvas fragment-shader effects. */

type Uniforms = Record<string, number | [number, number]>;

export type Renderer = {
  draw: (uniforms: Uniforms) => void;
  /** Runs after the canvas is resized to match its box. */
  onResize: (callback: () => void) => void;
};

const VERTEX = `attribute vec2 aPos; void main() { gl_Position = vec4(aPos, 0.0, 1.0); }`;

export function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function createRenderer(
  canvas: HTMLCanvasElement,
  fragment: string,
  { maxDpr = 1.5 }: { maxDpr?: number } = {},
): Renderer | null {
  const gl = canvas.getContext("webgl", { alpha: true, premultipliedAlpha: true, antialias: false });
  if (!gl) return null;

  const compile = (type: number, source: string) => {
    const shader = gl.createShader(type)!;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.warn(gl.getShaderInfoLog(shader));
      return null;
    }
    return shader;
  };
  const vs = compile(gl.VERTEX_SHADER, VERTEX);
  const fs = compile(gl.FRAGMENT_SHADER, fragment);
  if (!vs || !fs) return null;

  const program = gl.createProgram()!;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;
  gl.useProgram(program);

  // One triangle that covers the viewport.
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const aPos = gl.getAttribLocation(program, "aPos");
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  const locations = new Map<string, WebGLUniformLocation | null>();
  const location = (name: string) => {
    if (!locations.has(name)) locations.set(name, gl.getUniformLocation(program, name));
    return locations.get(name)!;
  };

  const resizeCallbacks: (() => void)[] = [];
  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
    const width = Math.max(1, Math.round(canvas.clientWidth * dpr));
    const height = Math.max(1, Math.round(canvas.clientHeight * dpr));
    if (canvas.width === width && canvas.height === height) return;
    canvas.width = width;
    canvas.height = height;
    gl.viewport(0, 0, width, height);
    for (const callback of resizeCallbacks) callback();
  };
  new ResizeObserver(resize).observe(canvas);
  resize();

  return {
    draw(uniforms) {
      gl.uniform2f(location("uRes"), canvas.width, canvas.height);
      for (const [name, value] of Object.entries(uniforms)) {
        if (Array.isArray(value)) gl.uniform2f(location(name), value[0], value[1]);
        else gl.uniform1f(location(name), value);
      }
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    },
    onResize(callback) {
      resizeCallbacks.push(callback);
    },
  };
}

/** Calls `frame` every animation frame while `el` is on screen and the tab is visible. */
export function runWhenVisible(el: Element, frame: (now: number) => void) {
  let onScreen = false;
  let raf = 0;
  const loop = (now: number) => {
    frame(now);
    raf = requestAnimationFrame(loop);
  };
  const update = () => {
    const run = onScreen && document.visibilityState === "visible";
    if (run && !raf) raf = requestAnimationFrame(loop);
    if (!run && raf) {
      cancelAnimationFrame(raf);
      raf = 0;
    }
  };
  new IntersectionObserver(([entry]) => {
    onScreen = entry.isIntersecting;
    update();
  }).observe(el);
  document.addEventListener("visibilitychange", update);
}
