"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { STARS, getStar } from "@/lib/stars";
import { useForja } from "@/lib/store";
import { Star } from "./Star";
import { BackgroundStars } from "./BackgroundStars";
import { nebulaTexture } from "./textures";

const EXPANSION_SECONDS = 4;

/** Camera framing presets. */
const HERO_POS = new THREE.Vector3(0, -0.5, 15.5);
// Look below the star so it sits high behind the title, leaving the
// lower two-thirds dark for legible intro text.
const HERO_LOOK = new THREE.Vector3(0, -5, 0);
const OVERVIEW_POS = new THREE.Vector3(2, 8, 40);
const OVERVIEW_LOOK = new THREE.Vector3(2, 0, -5);

function NebulaClouds() {
  const blue = useMemo(() => nebulaTexture("#3457a8"), []);
  const violet = useMemo(() => nebulaTexture("#6b3aa0"), []);
  const ember = useMemo(() => nebulaTexture("#a8541f"), []);
  return (
    <group>
      <sprite position={[-22, 6, -40]} scale={[60, 60, 1]}>
        <spriteMaterial
          map={violet}
          transparent
          opacity={0.5}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </sprite>
      <sprite position={[26, -10, -50]} scale={[70, 70, 1]}>
        <spriteMaterial
          map={blue}
          transparent
          opacity={0.45}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </sprite>
      <sprite position={[0, 0, -30]} scale={[42, 42, 1]}>
        <spriteMaterial
          map={ember}
          transparent
          opacity={0.4}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </sprite>
    </group>
  );
}

function CameraRig() {
  const { camera } = useThree();
  const phase = useForja((s) => s.phase);
  const activeStarId = useForja((s) => s.activeStarId);
  const reducedMotion = useForja((s) => s.reducedMotion);

  const desiredPos = useRef(new THREE.Vector3().copy(HERO_POS));
  const desiredLook = useRef(new THREE.Vector3().copy(HERO_LOOK));
  const currentLook = useRef(new THREE.Vector3().copy(HERO_LOOK));

  useFrame((state, delta) => {
    // Decide the target framing.
    if (phase === "hero") {
      desiredPos.current.copy(HERO_POS);
      desiredLook.current.copy(HERO_LOOK);
    } else if (activeStarId) {
      const s = getStar(activeStarId);
      const p = new THREE.Vector3(...s.position);
      const dist = s.size * 5.0 + 6.5;
      desiredPos.current.set(
        p.x + s.size * 2.2,
        p.y + s.size * 0.9,
        p.z + dist,
      );
      desiredLook.current.copy(p);
    } else {
      desiredPos.current.copy(OVERVIEW_POS);
      desiredLook.current.copy(OVERVIEW_LOOK);
    }

    // Gentle pointer parallax (skipped when focused or reduced motion).
    if (!activeStarId && !reducedMotion) {
      const px = state.pointer.x;
      const py = state.pointer.y;
      desiredPos.current.x += px * 2.2;
      desiredPos.current.y += py * 1.6;
    }

    const lambda = reducedMotion ? 24 : 3.2;
    easeVec(camera.position, desiredPos.current, lambda, delta);
    easeVec(currentLook.current, desiredLook.current, lambda, delta);
    camera.lookAt(currentLook.current);
  });

  return null;
}

export function Scene() {
  const phase = useForja((s) => s.phase);
  const activeStarId = useForja((s) => s.activeStarId);
  const finishExpansion = useForja((s) => s.finishExpansion);
  const focusStar = useForja((s) => s.focusStar);

  // Shared 0..1 expansion progress. Updated every frame here and read by each
  // Star inside its own useFrame, so the animation runs per-frame without
  // relying on React re-renders.
  const progress = useRef(0);

  // Reset the expansion timeline whenever we return to the hero cover.
  useEffect(() => {
    if (phase === "hero") progress.current = 0;
  }, [phase]);

  useFrame((_, delta) => {
    if (phase === "expanding") {
      progress.current = Math.min(1, progress.current + delta / EXPANSION_SECONDS);
      if (progress.current >= 1) finishExpansion();
    } else if (phase === "explore") {
      progress.current = 1;
    }
  });

  const showLabels = phase === "explore";

  return (
    <>
      <color attach="background" args={["#04040a"]} />
      <fog attach="fog" args={["#04040a", 30, 95]} />
      <ambientLight intensity={0.4} />

      <BackgroundStars count={1500} />
      <NebulaClouds />

      {STARS.map((s) => (
        <Star
          key={s.id}
          data={s}
          phase={phase}
          progress={progress}
          active={activeStarId === s.id}
          anyActive={activeStarId !== null}
          showLabel={showLabels}
          onSelect={focusStar}
        />
      ))}

      <CameraRig />
    </>
  );
}

function easeVec(
  current: THREE.Vector3,
  target: THREE.Vector3,
  lambda: number,
  delta: number,
) {
  current.x = THREE.MathUtils.damp(current.x, target.x, lambda, delta);
  current.y = THREE.MathUtils.damp(current.y, target.y, lambda, delta);
  current.z = THREE.MathUtils.damp(current.z, target.z, lambda, delta);
}
