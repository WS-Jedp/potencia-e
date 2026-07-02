"use client";

import { useMemo, useRef, useState, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { Billboard, Html } from "@react-three/drei";
import * as THREE from "three";
import { STARS, type StarData } from "@/lib/stars";
import type { Phase } from "@/lib/store";
import { radialGlowTexture } from "./textures";

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
  const [hovered, setHovered] = useState(false);

  const glowTex = useMemo(() => radialGlowTexture(data.glow), [data.glow]);
  const coreTex = useMemo(() => radialGlowTexture(data.core), [data.core]);
  const coreColor = useMemo(() => new THREE.Color(data.core), [data.core]);
  const isCentral = data.index === 0;

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

    if (halo.current) {
      const mat = halo.current.material as THREE.SpriteMaterial;
      const pulse = 1 + Math.sin(t * 0.9 + seed) * 0.06;
      const haloScale = data.size * (isCentral ? 7.5 : 6) * pulse;
      halo.current.scale.setScalar(haloScale);
      mat.opacity = (isCentral ? 0.85 : 0.7) * dim * (0.7 + smooth.current * 0.5);
    }
    if (flare.current) {
      const mat = flare.current.material as THREE.SpriteMaterial;
      flare.current.scale.setScalar(data.size * 3.1);
      mat.opacity = (0.9 * dim) * (0.85 + smooth.current * 0.3);
    }
    if (core.current) {
      const mat = core.current.material as THREE.MeshBasicMaterial;
      mat.opacity = dim;
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
      </Billboard>

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
