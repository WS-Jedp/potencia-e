"use client";

import { useEffect } from "react";
import { StarField } from "@/components/three/StarField";
import { Hero } from "@/components/overlay/Hero";
import { Hud } from "@/components/overlay/Hud";
import { StarPanel } from "@/components/overlay/StarPanel";
import { Grain } from "@/components/overlay/Grain";
import { useForja } from "@/lib/store";

export default function Home() {
  const setReducedMotion = useForja((s) => s.setReducedMotion);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [setReducedMotion]);

  return (
    <main className="vignette relative h-dvh w-screen overflow-hidden bg-bg-0">
      <StarField />
      <Hero />
      <Hud />
      <StarPanel />
      <Grain />
    </main>
  );
}
