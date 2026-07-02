import { create } from "zustand";
import { SECONDARY_STARS, STARS, type StarId } from "./stars";

export type Phase = "hero" | "expanding" | "explore";

interface ForjaState {
  phase: Phase;
  /** Currently focused star (camera target + open panel). null = overview. */
  activeStarId: StarId | null;
  /** True while in guided linear journey mode. */
  journeyActive: boolean;
  /** Whether reduced motion is preferred. */
  reducedMotion: boolean;

  beginExpansion: () => void;
  finishExpansion: () => void;
  focusStar: (id: StarId) => void;
  closePanel: () => void;
  startJourney: () => void;
  journeyNext: () => void;
  journeyPrev: () => void;
  stopJourney: () => void;
  setReducedMotion: (v: boolean) => void;
  reset: () => void;
}

export const useForja = create<ForjaState>((set, get) => ({
  phase: "hero",
  activeStarId: null,
  journeyActive: false,
  reducedMotion: false,

  beginExpansion: () => {
    if (get().phase !== "hero") return;
    set({ phase: "expanding" });
  },

  finishExpansion: () => {
    if (get().phase !== "expanding") return;
    set({ phase: "explore" });
  },

  focusStar: (id) => set({ activeStarId: id, journeyActive: false }),

  closePanel: () => set({ activeStarId: null }),

  startJourney: () =>
    set({ journeyActive: true, activeStarId: STARS[0].id }),

  journeyNext: () => {
    const { activeStarId } = get();
    const current = STARS.findIndex((s) => s.id === activeStarId);
    const next = Math.min(current + 1, STARS.length - 1);
    set({ activeStarId: STARS[next].id, journeyActive: true });
  },

  journeyPrev: () => {
    const { activeStarId } = get();
    const current = STARS.findIndex((s) => s.id === activeStarId);
    const prev = Math.max(current - 1, 0);
    set({ activeStarId: STARS[prev].id, journeyActive: true });
  },

  stopJourney: () => set({ journeyActive: false, activeStarId: null }),

  setReducedMotion: (v) => set({ reducedMotion: v }),

  reset: () =>
    set({ phase: "hero", activeStarId: null, journeyActive: false }),
}));

export const secondaryCount = SECONDARY_STARS.length;
