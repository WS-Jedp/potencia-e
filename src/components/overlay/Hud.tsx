"use client";

import { AnimatePresence, motion } from "framer-motion";
import { STARS } from "@/lib/stars";
import { useForja } from "@/lib/store";

export function Hud() {
  const phase = useForja((s) => s.phase);
  const activeStarId = useForja((s) => s.activeStarId);
  const startJourney = useForja((s) => s.startJourney);
  const focusStar = useForja((s) => s.focusStar);
  const reset = useForja((s) => s.reset);

  const visible = phase === "explore";

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="pointer-events-none fixed inset-0 z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 0.3, duration: 0.8 } }}
          exit={{ opacity: 0 }}
        >
          {/* Top-left brand / home */}
          <div className="pointer-events-auto absolute left-5 top-5 flex items-center gap-3">
            <button
              type="button"
              onClick={reset}
              className="group flex items-center gap-2.5"
              aria-label="Volver al inicio"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-ember opacity-70 [animation:pulse-ring_2.4s_ease-out_infinite]" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-ember-soft" />
              </span>
              <span className="font-display text-sm tracking-wide text-ink-soft transition-colors group-hover:text-ink">
                La Forja
              </span>
            </button>
          </div>

          {/* Left star navigator (desktop) */}
          <div className="pointer-events-auto absolute left-5 top-1/2 hidden -translate-y-1/2 flex-col gap-1 md:flex">
            {STARS.map((s) => {
              const on = s.id === activeStarId;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => focusStar(s.id)}
                  className="group flex items-center gap-3 py-1.5 text-left"
                >
                  <span
                    className="h-2 w-2 rounded-full border transition-all duration-300"
                    style={{
                      background: on ? s.core : "transparent",
                      borderColor: on ? s.core : "rgba(255,255,255,0.3)",
                      boxShadow: on ? `0 0 10px ${s.glow}` : "none",
                      transform: on ? "scale(1.3)" : "scale(1)",
                    }}
                  />
                  <span
                    className="text-[11px] uppercase tracking-[0.18em] transition-all duration-300"
                    style={{
                      color: on ? s.core : "rgba(255,255,255,0.4)",
                      opacity: on ? 1 : 0.7,
                    }}
                  >
                    {s.name}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Bottom controls — only in overview (no panel open) */}
          <AnimatePresence>
            {!activeStarId && (
              <motion.div
                className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-3 px-4 pb-7"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
              >
                <button
                  type="button"
                  onClick={startJourney}
                  className="group pointer-events-auto relative overflow-hidden rounded-full border border-ember/40 bg-ember/5 px-8 py-3 text-xs font-semibold uppercase tracking-[0.28em] text-ember-soft backdrop-blur-sm transition-colors duration-500 hover:text-bg-0"
                >
                  <span
                    className="absolute inset-0 origin-bottom scale-y-0 bg-gradient-to-t from-ember to-ember-soft transition-transform duration-500 ease-out group-hover:scale-y-100"
                    aria-hidden
                  />
                  <span className="relative z-10">Seguir el Camino</span>
                </button>
                <span className="text-[10px] uppercase tracking-[0.32em] text-ink-faint">
                  o toca una estrella para explorar
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
