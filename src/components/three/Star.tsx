"use client";

import { useMemo, useRef, useState, type RefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Billboard, Html } from "@react-three/drei";
import * as THREE from "three";
import { STARS, type StarData } from "@/lib/stars";
import type { Phase } from "@/lib/store";
import { radialGlowTexture, ringTexture } from "./textures";

/* -------------------------------------------------------------------------- */
/* Orbiting particles (GPU shader)                                             */
/* -------------------------------------------------------------------------- */

const particleVertex = /* glsl */ `
  attribute float aRadius;
  attribute float aSpeed;
  attribute float aPhase;
  attribute float aTilt;
  attribute float aYaw;
  attribute float aSize;
  uniform float uTime;
  uniform float uSpin;
  uniform float uAppear;
  uniform float uBoost;
  uniform float uPixelRatio;
  varying float vAlpha;

  void main() {
    float th = aPhase + aSpeed * uTime + uSpin;
    vec3 p = vec3(cos(th), 0.0, sin(th)) * aRadius * uAppear;

    // Tilt the orbit plane around X, then rotate it around Y so every
    // particle rides its own inclined orbit (a small "electron cloud").
    float ct = cos(aTilt); float st = sin(aTilt);
    p = vec3(p.x, -p.z * st, p.z * ct);
    float cy = cos(aYaw); float sy = sin(aYaw);
    p = vec3(p.x * cy + p.z * sy, p.y, -p.x * sy + p.z * cy);

    vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);

    // Per-particle twinkle + fade-in while the star is being born.
    float tw = 0.55 + 0.45 * sin(uTime * 2.2 + aPhase * 7.0);
    vAlpha = tw * smoothstep(0.12, 0.55, uAppear);

    gl_PointSize = aSize * (1.0 + uBoost * 0.8) * uPixelRatio * (220.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const particleFragment = /* glsl */ `
  precision mediump float;
  uniform vec3 uColor;
  uniform float uOpacity;
  varying float vAlpha;

  void main() {
    vec2 c = gl_PointCoord - vec2(0.5);
    float d = length(c);
    float core = smoothstep(0.5, 0.05, d);
    float alpha = core * vAlpha * uOpacity;
    if (alpha < 0.015) discard;
    // Hot white center melting into the star's glow color.
    vec3 col = mix(uColor, vec3(1.0), core * 0.55);
    gl_FragColor = vec4(col, alpha);
  }
`;

interface OrbitUniforms {
  uTime: { value: number };
  uSpin: { value: number };
  uAppear: { value: number };
  uBoost: { value: number };
  uOpacity: { value: number };
  uPixelRatio: { value: number };
  uColor: { value: THREE.Color };
  [key: string]: { value: unknown };
}

function useOrbitGeometry(star: StarData, count: number) {
  return useMemo(() => {
    const radius = new Float32Array(count);
    const speed = new Float32Array(count);
    const phase = new Float32Array(count);
    const tilt = new Float32Array(count);
    const yaw = new Float32Array(count);
    const size = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      radius[i] = star.size * THREE.MathUtils.lerp(2.0, 3.6, Math.random());
      speed[i] = THREE.MathUtils.lerp(0.25, 0.75, Math.random());
      phase[i] = Math.random() * Math.PI * 2;
      tilt[i] = THREE.MathUtils.lerp(-0.65, 0.65, Math.random());
      yaw[i] = Math.random() * Math.PI * 2;
      size[i] = THREE.MathUtils.lerp(1.1, 2.6, Math.pow(Math.random(), 2));
    }

    const g = new THREE.BufferGeometry();
    // Positions are computed in the shader; the attribute just needs to exist.
    g.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(count * 3), 3),
    );
    g.setAttribute("aRadius", new THREE.BufferAttribute(radius, 1));
    g.setAttribute("aSpeed", new THREE.BufferAttribute(speed, 1));
    g.setAttribute("aPhase", new THREE.BufferAttribute(phase, 1));
    g.setAttribute("aTilt", new THREE.BufferAttribute(tilt, 1));
    g.setAttribute("aYaw", new THREE.BufferAttribute(yaw, 1));
    g.setAttribute("aSize", new THREE.BufferAttribute(size, 1));
    return g;
  }, [star.size, count]);
}

interface StarProps {
  data: StarData;
  /** Current experience phase. */
  phase: Phase;
  /** Shared 0..1 expansion progress, updated every frame by the Scene. */
  progress: RefObject<number>;
  /** Whether this star is the active/focused one. */
  active: boolean;
  /** Whether any star is active (dims the non-active ones). */
  anyActive: boolean;
  /** Show the floating label. */
  showLabel: boolean;
  onSelect: (id: StarData["id"]) => void;
}

const TOTAL = STARS.length;
// How much extra rotation a star leads with at birth, unwinding as it settles
// into orbit (radians). Creates a spiral-out trajectory.
const SWIRL = 1.5;

export function Star({
  data,
  phase,
  progress,
  active,
  anyActive,
  showLabel,
  onSelect,
}: StarProps) {
  const group = useRef<THREE.Group>(null);
  const core = useRef<THREE.Mesh>(null);
  const halo = useRef<THREE.Sprite>(null);
  const flare = useRef<THREE.Sprite>(null);
  const auraRef = useRef<THREE.Sprite>(null);
  const ringA = useRef<THREE.Sprite>(null);
  const ringB = useRef<THREE.Sprite>(null);
  const [hovered, setHovered] = useState(false);

  const glowTex = useMemo(() => radialGlowTexture(data.glow), [data.glow]);
  const coreTex = useMemo(() => radialGlowTexture(data.core), [data.core]);
  const ringTex = useMemo(() => ringTexture(data.core), [data.core]);
  const coreColor = useMemo(() => new THREE.Color(data.core), [data.core]);
  const isCentral = data.index === 0;

  const dpr = useThree((s) => s.gl.getPixelRatio());
  const particleCount = isCentral ? 90 : 60;
  const orbitGeometry = useOrbitGeometry(data, particleCount);
  const orbitUniforms = useMemo<OrbitUniforms>(
    () => ({
      uTime: { value: 0 },
      uSpin: { value: 0 },
      uAppear: { value: 0 },
      uBoost: { value: 0 },
      uOpacity: { value: 0.65 },
      uPixelRatio: { value: dpr },
      uColor: { value: new THREE.Color(data.glow) },
    }),
    [dpr, data.glow],
  );

  // Final orbit expressed in polar form (XZ plane) so we can spiral toward it.
  const orbit = useMemo(() => {
    const [x, y, z] = data.position;
    return {
      angle: Math.atan2(z, x),
      radiusXZ: Math.hypot(x, z),
      y,
    };
  }, [data.position]);

  // When this star starts emerging, relative to the whole expansion timeline.
  const birthStagger = useMemo(
    () => ((data.index - 1) / Math.max(1, TOTAL - 1)) * 0.5,
    [data.index],
  );

  // Per-star twinkle offset so they don't pulse in unison.
  const seed = useMemo(() => Math.random() * Math.PI * 2, []);
  const smooth = useRef(0);

  useFrame((state, delta) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;

    // Resolve this star's own birth progress for the current frame.
    let appear: number;
    if (phase === "hero") {
      appear = isCentral ? 1 : 0;
    } else if (phase === "explore") {
      appear = 1;
    } else if (isCentral) {
      appear = 1;
    } else {
      appear = THREE.MathUtils.clamp(
        (progress.current - birthStagger) / (1 - birthStagger),
        0,
        1,
      );
    }

    // Birth: spiral out from the center into the final orbit.
    const eased = easeOutCubic(appear);
    if (isCentral) {
      group.current.position.set(0, 0, 0);
    } else {
      const ang = orbit.angle + (1 - eased) * SWIRL;
      const rxz = orbit.radiusXZ * eased;
      group.current.position.set(
        Math.cos(ang) * rxz,
        orbit.y * eased,
        Math.sin(ang) * rxz,
      );
    }

    // Hover / active emphasis (smoothed).
    const emphasis = active ? 1 : hovered ? 0.6 : 0;
    smooth.current = THREE.MathUtils.damp(smooth.current, emphasis, 6, delta);

    const baseScale = isCentral ? 1 : eased;
    const twinkle = 1 + Math.sin(t * 1.6 + seed) * 0.04;
    const grow = 1 + smooth.current * 0.22;
    group.current.scale.setScalar(baseScale * twinkle * grow);

    // Dim non-active stars when something is focused.
    const dim = anyActive && !active ? 0.45 : 1;
    const focus = smooth.current;

    if (halo.current) {
      const mat = halo.current.material as THREE.SpriteMaterial;
      const pulse = 1 + Math.sin(t * 0.9 + seed) * 0.06;
      const haloScale = data.size * (isCentral ? 7.5 : 6) * pulse;
      halo.current.scale.setScalar(haloScale);
      mat.opacity = (isCentral ? 0.85 : 0.7) * dim * (0.7 + focus * 0.5);
    }
    if (flare.current) {
      const mat = flare.current.material as THREE.SpriteMaterial;
      flare.current.scale.setScalar(data.size * 3.1);
      mat.opacity = (0.9 * dim) * (0.85 + focus * 0.3);
    }
    if (core.current) {
      const mat = core.current.material as THREE.MeshBasicMaterial;
      mat.opacity = dim;
    }

    // Orbiting particles: always alive, faster + brighter when focused.
    orbitUniforms.uTime.value = t;
    orbitUniforms.uSpin.value += delta * (0.15 + focus * 1.1);
    orbitUniforms.uAppear.value = eased;
    orbitUniforms.uBoost.value = focus;
    orbitUniforms.uOpacity.value = (0.62 + focus * 0.38) * dim;

    // Dynamic aura: a breathing corona that swells while focused/hovered.
    if (auraRef.current) {
      const mat = auraRef.current.material as THREE.SpriteMaterial;
      const breath = 1 + Math.sin(t * 2.4 + seed) * 0.09;
      auraRef.current.scale.setScalar(
        data.size * (4.6 + focus * 4.2) * breath,
      );
      mat.opacity = focus * 0.55 * dim;
      mat.rotation = t * 0.22;
    }

    // Focus rings: two counter-rotating energy rings that expand into place.
    if (ringA.current) {
      const mat = ringA.current.material as THREE.SpriteMaterial;
      const wobble = 1 + Math.sin(t * 1.7 + seed) * 0.05;
      ringA.current.scale.setScalar(
        data.size * (3.4 + focus * 2.6) * wobble,
      );
      mat.opacity = focus * 0.8 * dim;
      mat.rotation = t * 0.6;
    }
    if (ringB.current) {
      const mat = ringB.current.material as THREE.SpriteMaterial;
      const wobble = 1 + Math.cos(t * 1.3 + seed) * 0.06;
      ringB.current.scale.setScalar(
        data.size * (4.4 + focus * 3.4) * wobble,
      );
      mat.opacity = focus * 0.45 * dim;
      mat.rotation = -t * 0.35;
    }
  });

  const radius = data.size;

  return (
    <group
      ref={group}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = "auto";
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(data.id);
      }}
    >
      {/* Outer soft halo */}
      <Billboard>
        <sprite ref={halo}>
          <spriteMaterial
            map={glowTex}
            color={data.glow}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </sprite>
        {/* Bright inner flare */}
        <sprite ref={flare}>
          <spriteMaterial
            map={coreTex}
            color={data.core}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </sprite>
        {/* Dynamic focus aura: breathing corona, visible when focused */}
        <sprite ref={auraRef}>
          <spriteMaterial
            map={glowTex}
            color={data.glow}
            transparent
            opacity={0}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </sprite>
        {/* Counter-rotating energy rings, visible when focused */}
        <sprite ref={ringA}>
          <spriteMaterial
            map={ringTex}
            color={data.core}
            transparent
            opacity={0}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </sprite>
        <sprite ref={ringB}>
          <spriteMaterial
            map={ringTex}
            color={data.glow}
            transparent
            opacity={0}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </sprite>
      </Billboard>

      {/* Orbiting particle cloud */}
      <points geometry={orbitGeometry}>
        <shaderMaterial
          vertexShader={particleVertex}
          fragmentShader={particleFragment}
          uniforms={orbitUniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Solid core */}
      <mesh ref={core}>
        <sphereGeometry args={[radius, 48, 48]} />
        <meshBasicMaterial
          color={coreColor}
          transparent
          toneMapped={false}
        />
      </mesh>

      {/* Invisible larger hit area for easier clicking */}
      <mesh visible={false}>
        <sphereGeometry args={[radius * 2.4, 8, 8]} />
        <meshBasicMaterial />
      </mesh>

      {showLabel && (
        <Billboard position={[0, radius * 2.1 + 0.75, 0]}>
          <Html center distanceFactor={isCentral ? 14 : 11} pointerEvents="none">
            <div
              style={{ opacity: anyActive && !active ? 0.4 : 1 }}
              className="select-none whitespace-nowrap text-center transition-opacity duration-500"
            >
              <div
                className={`font-display leading-none tracking-wide ${
                  isCentral ? "text-[26px] sm:text-[30px]" : "text-[20px] sm:text-[24px]"
                }`}
                style={{ color: data.core, textShadow: `0 0 18px ${data.glow}` }}
              >
                {data.name}
              </div>
            </div>
          </Html>
        </Billboard>
      )}
    </group>
  );
}

function easeOutCubic(x: number): number {
  return 1 - Math.pow(1 - x, 3);
}
