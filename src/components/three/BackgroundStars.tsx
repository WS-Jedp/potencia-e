"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const vertexShader = /* glsl */ `
  attribute float aSize;
  attribute float aPhase;
  uniform float uTime;
  uniform float uPixelRatio;
  varying float vTwinkle;

  void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    // Per-star twinkle: each star breathes on its own phase.
    vTwinkle = 0.55 + 0.45 * sin(uTime * 1.2 + aPhase);
    // Perspective size attenuation -> distant stars look smaller (depth).
    gl_PointSize = aSize * uPixelRatio * (260.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = /* glsl */ `
  precision mediump float;
  varying float vTwinkle;

  void main() {
    // Round, soft-edged point.
    vec2 c = gl_PointCoord - vec2(0.5);
    float d = length(c);
    float core = smoothstep(0.5, 0.0, d);
    float alpha = core * vTwinkle;
    if (alpha < 0.02) discard;
    gl_FragColor = vec4(vec3(1.0), alpha);
  }
`;

interface BackgroundStarsProps {
  count?: number;
}

/**
 * Procedural night-sky starfield: white points scattered on a large spherical
 * shell around the scene. Sizes vary (most tiny, a few bright) to create a
 * sense of depth, each point twinkles independently, and the whole field drifts
 * slowly for a living-sky feel. Unaffected by scene fog (custom shader).
 */
export function BackgroundStars({ count = 1400 }: BackgroundStarsProps) {
  const group = useRef<THREE.Group>(null);
  const material = useRef<THREE.ShaderMaterial>(null);
  const dpr = useThree((s) => s.gl.getPixelRatio());

  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const phases = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Uniformly distributed direction on a sphere.
      const u = Math.random();
      const v = Math.random();
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);
      // Vary radius so stars sit at different depths.
      const r = THREE.MathUtils.lerp(70, 165, Math.random());

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      // Heavily biased toward small stars, with a few large bright ones.
      sizes[i] = 0.6 + Math.pow(Math.random(), 3) * 6.5;
      phases[i] = Math.random() * Math.PI * 2;
    }

    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    g.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));
    return g;
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPixelRatio: { value: dpr },
    }),
    [dpr],
  );

  useFrame((state, delta) => {
    if (material.current) {
      material.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
    if (group.current) {
      group.current.rotation.y += delta * 0.006;
      group.current.rotation.x += delta * 0.0022;
    }
  });

  return (
    <group ref={group}>
      <points geometry={geometry}>
        <shaderMaterial
          ref={material}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}
