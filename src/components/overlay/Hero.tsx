"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useForja } from "@/lib/store";

export function Hero() {
  const phase = useForja((s) => s.phase);
  const beginExpansion = useForja((s) => s.beginExpansion);

  return (
    <AnimatePresence>
      {phase === "hero" && (
        <motion.div
          className="pointer-events-none fixed inset-0 z-30 flex flex-col items-center justify-center px-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8 } }}
        >
          <motion.p
            className="mb-6 text-[11px] font-medium uppercase tracking-[0.55em] text-ember-soft/80"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            El Plan Celestial
          </motion.p>

          <motion.h1
            className="font-display text-[clamp(3.5rem,15vw,11rem)] font-light leading-[0.9] text-gold"
            style={{ textShadow: "0 0 60px rgba(255,157,47,0.45)" }}
            initial={{ opacity: 0, scale: 1.06, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          >
            Ignición
          </motion.h1>

          <motion.p
            className="mt-3 font-display text-[clamp(1.1rem,3.4vw,1.8rem)] italic text-ink-soft"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 1.1 }}
          >
            Potencia E y yo
          </motion.p>

          <motion.div
            className="mt-9 max-w-xl space-y-1.5 text-[15px] leading-relaxed text-ink-soft/85 sm:text-base"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6, duration: 1.1 }}
          >
            <p>Soy Juan Esteban Deossa Pertuz, de Medellín, Antioquia — con raíces en Sapzurro, Chocó.</p>
            <p>Llegué al límite del software. Ahora voy por los átomos.</p>
            <p className="text-ink-faint">
              El plan que enciendo con Potencia E e Ingeniería Física en EAFIT.
            </p>
          </motion.div>

          <motion.button
            type="button"
            onClick={beginExpansion}
            className="pointer-events-auto group relative mt-12 overflow-hidden rounded-full border border-ember/40 bg-ember/5 px-9 py-3.5 text-[13px] font-semibold uppercase tracking-[0.3em] text-ember-soft backdrop-blur-sm transition-colors duration-500 hover:text-bg-0"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.1, duration: 1 }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            <span
              className="absolute inset-0 -z-0 origin-bottom scale-y-0 bg-gradient-to-t from-ember to-ember-soft transition-transform duration-500 ease-out group-hover:scale-y-100"
              aria-hidden
            />
            <span className="relative z-10">Iniciar el Viaje</span>
          </motion.button>

          <motion.div
            className="mt-14 flex flex-col items-center gap-2 text-ink-faint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.6, duration: 1 }}
          >
            <span className="text-[10px] uppercase tracking-[0.4em]">
              Todo nace del centro
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
