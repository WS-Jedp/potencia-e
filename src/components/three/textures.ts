import * as THREE from "three";

/** Cache so we only build each gradient texture once. */
const cache = new Map<string, THREE.Texture>();

/**
 * Soft radial glow sprite (additive). Bright core fading to transparent.
 */
export function radialGlowTexture(color = "#ffffff"): THREE.Texture {
  const key = `glow:${color}`;
  const cached = cache.get(key);
  if (cached) return cached;

  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createRadialGradient(
    size / 2,
    size / 2,
    0,
    size / 2,
    size / 2,
    size / 2,
  );
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.18, hexToRgba(color, 0.95));
  g.addColorStop(0.45, hexToRgba(color, 0.35));
  g.addColorStop(0.75, hexToRgba(color, 0.08));
  g.addColorStop(1, hexToRgba(color, 0));
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  cache.set(key, tex);
  return tex;
}

/**
 * Thin annular ring with a bright rim — used for the focus "energy rings"
 * around an active star.
 */
export function ringTexture(color = "#ffffff"): THREE.Texture {
  const key = `ring:${color}`;
  const cached = cache.get(key);
  if (cached) return cached;

  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createRadialGradient(
    size / 2,
    size / 2,
    0,
    size / 2,
    size / 2,
    size / 2,
  );
  g.addColorStop(0, hexToRgba(color, 0));
  g.addColorStop(0.62, hexToRgba(color, 0));
  g.addColorStop(0.72, hexToRgba(color, 0.55));
  g.addColorStop(0.76, "rgba(255,255,255,0.85)");
  g.addColorStop(0.82, hexToRgba(color, 0.4));
  g.addColorStop(0.92, hexToRgba(color, 0));
  g.addColorStop(1, hexToRgba(color, 0));
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  cache.set(key, tex);
  return tex;
}

/**
 * Diffuse nebula blob — large, irregular, very soft. Used for atmosphere.
 */
export function nebulaTexture(color = "#5a9bff"): THREE.Texture {
  const key = `neb:${color}`;
  const cached = cache.get(key);
  if (cached) return cached;

  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  // Layer a few offset radial gradients for an organic cloud.
  const blobs = 5;
  for (let i = 0; i < blobs; i++) {
    const cx = size * (0.35 + Math.random() * 0.3);
    const cy = size * (0.35 + Math.random() * 0.3);
    const r = size * (0.25 + Math.random() * 0.25);
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    g.addColorStop(0, hexToRgba(color, 0.5));
    g.addColorStop(0.5, hexToRgba(color, 0.12));
    g.addColorStop(1, hexToRgba(color, 0));
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  cache.set(key, tex);
  return tex;
}

function hexToRgba(hex: string, alpha: number): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}
