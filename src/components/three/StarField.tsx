"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { Scene } from "./Scene";

export function StarField() {
  return (
    <Canvas
      className="!fixed inset-0"
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 12], fov: 55, near: 0.1, far: 200 }}
    >
      <Suspense fallback={null}>
        <Scene />
      </Suspense>
    </Canvas>
  );
}
