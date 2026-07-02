"use client";

import { Fragment, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { STARS, getStar, type StarData } from "@/lib/stars";
import { useForja } from "@/lib/store";

export function StarPanel() {
  const phase = useForja((s) => s.phase);
  const activeStarId = useForja((s) => s.activeStarId);
  const closePanel = useForja((s) => s.closePanel);
  const journeyNext = useForja((s) => s.journeyNext);
  const journeyPrev = useForja((s) => s.journeyPrev);

  const star = activeStarId ? getStar(activeStarId) : null;
  const open = phase === "explore" && !!star;
  const index = star ? star.index : -1;
  const isFirst = index <= 0;
  const isLast = index >= STARS.length - 1;

  return (
    <AnimatePresence>
      {open && star && (
        <motion.aside
          key={star.id}
          className="pointer-events-none fixed inset-x-0 bottom-0 z-30 flex justify-center px-3 pb-3 sm:inset-y-0 sm:right-0 sm:left-auto sm:items-center sm:justify-end sm:px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <motion.article
            className="scroll-elegant pointer-events-auto max-h-[72vh] w-full max-w-lg overflow-y-auto overflow-x-hidden rounded-3xl border border-white/10 bg-[#070710]/85 backdrop-blur-2xl sm:max-h-[88vh]"
            initial={{ y: 40, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 30, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            style={{
              boxShadow: `0 40px 120px -30px ${star.glow}40, inset 0 1px 0 rgba(255,255,255,0.05)`,
            }}
          >
            <ReaderHeader star={star} onClose={closePanel} />

            <div className="px-6 pb-2 pt-5 sm:px-8">
              <PriorityPill star={star} />
              <Body star={star} />
              <Gallery star={star} />
              <KeyPoints star={star} />
            </div>

            <NavFooter
              star={star}
              index={index}
              isFirst={isFirst}
              isLast={isLast}
              onPrev={journeyPrev}
              onNext={journeyNext}
              onClose={closePanel}
            />
          </motion.article>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}

/* -------------------------------------------------------------------------- */
/* Header: full-bleed "aurora" banner (or hero image) + title overlay         */
/* -------------------------------------------------------------------------- */

function ReaderHeader({
  star,
  onClose,
}: {
  star: StarData;
  onClose: () => void;
}) {
  const hero = star.media?.[0];
  const eyebrow =
    star.index === 0 ? "Estrella central" : `Estrella ${star.index}`;

  return (
    <header className="relative h-44 overflow-hidden sm:h-48">
      {hero ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={hero.src}
            alt={hero.alt ?? star.name}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-[#070710] via-[#070710]/55 to-[#070710]/20" />
        </>
      ) : (
        <Aurora core={star.core} glow={star.glow} />
      )}

      <button
        type="button"
        onClick={onClose}
        aria-label="Cerrar"
        className="absolute right-4 top-4 z-10 rounded-full border border-white/15 bg-[#070710]/40 p-2 text-ink-soft backdrop-blur-md transition-colors hover:border-white/35 hover:text-ink"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M3 3l10 10M13 3L3 13"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </button>

      <div className="absolute inset-x-0 bottom-0 px-6 pb-5 sm:px-8">
        <motion.div
          className="mb-2 flex items-center gap-2"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <span
            className="inline-block h-2.5 w-2.5 rounded-full"
            style={{ background: star.core, boxShadow: `0 0 12px ${star.glow}` }}
          />
          <span className="text-[10px] font-medium uppercase tracking-[0.35em] text-ink-soft/80">
            {eyebrow}
          </span>
        </motion.div>

        <motion.h2
          className="font-display text-[2.6rem] font-light leading-[0.95] sm:text-5xl"
          style={{ color: star.core, textShadow: `0 2px 30px ${star.glow}55` }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          {star.name}
        </motion.h2>

        <motion.p
          className="mt-1.5 font-display text-lg italic text-ink-soft sm:text-xl"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22 }}
        >
          {star.tagline}
        </motion.p>
      </div>
    </header>
  );
}

function Aurora({ core, glow }: { core: string; glow: string }) {
  return (
    <div className="absolute inset-0">
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(130% 120% at 18% 0%, ${core}22, transparent 55%), linear-gradient(135deg, ${glow}30, transparent 65%)`,
        }}
      />
      <motion.div
        className="absolute -left-12 -top-12 h-44 w-44 rounded-full blur-3xl"
        style={{ background: glow }}
        animate={{ opacity: [0.22, 0.4, 0.22], scale: [1, 1.18, 1] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-16 right-0 h-48 w-48 rounded-full blur-3xl"
        style={{ background: core }}
        animate={{ opacity: [0.12, 0.28, 0.12], scale: [1.1, 1, 1.1] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="absolute inset-0 bg-linear-to-t from-[#070710] via-[#070710]/35 to-transparent" />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Priority                                                                    */
/* -------------------------------------------------------------------------- */

function PriorityPill({ star }: { star: StarData }) {
  return (
    <motion.span
      className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em]"
      style={{
        color: star.glow,
        borderColor: `${star.glow}55`,
        background: `${star.glow}12`,
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.28 }}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ background: star.glow }}
      />
      Prioridad · {star.priority}
    </motion.span>
  );
}

/* -------------------------------------------------------------------------- */
/* Body: lead paragraph (larger) + rhythm paragraphs, with **bold** support    */
/* -------------------------------------------------------------------------- */

function Body({ star }: { star: StarData }) {
  const paragraphs = groupIntoParagraphs(star.body);

  return (
    <div className="mt-5 space-y-4">
      {paragraphs.map((p, i) => (
        <motion.p
          key={i}
          className={
            i === 0
              ? "text-[1.0625rem] leading-relaxed text-ink-soft"
              : "text-[15px] leading-relaxed text-ink-soft/80"
          }
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.32 + i * 0.08 }}
        >
          {renderRich(p, star.glow)}
        </motion.p>
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Gallery (only when the star has media)                                      */
/* -------------------------------------------------------------------------- */

function Gallery({ star }: { star: StarData }) {
  if (!star.media || star.media.length === 0) return null;

  return (
    <div className="scroll-elegant -mx-1 mt-6 flex gap-3 overflow-x-auto px-1 pb-2">
      {star.media.map((m, i) => (
        <figure key={i} className="shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={m.src}
            alt={m.alt ?? ""}
            className="h-40 w-64 rounded-xl border border-white/10 object-cover"
            style={{ boxShadow: `0 12px 40px -16px ${star.glow}55` }}
          />
          {m.caption && (
            <figcaption className="mt-2 text-[11px] text-ink-faint">
              {m.caption}
            </figcaption>
          )}
        </figure>
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Key points                                                                  */
/* -------------------------------------------------------------------------- */

function KeyPoints({ star }: { star: StarData }) {
  return (
    <div className="mt-7">
      <div className="mb-3 flex items-center gap-3">
        <span
          className="text-[10px] font-semibold uppercase tracking-[0.3em]"
          style={{ color: star.glow }}
        >
          En esencia
        </span>
        <span className="h-px flex-1 bg-white/10" />
      </div>

      <ul className="overflow-hidden rounded-2xl border border-white/10 bg-white/2">
        {star.points.map((p, i) => (
          <motion.li
            key={i}
            className="flex items-start gap-3 border-b border-white/6 px-4 py-3 text-sm leading-snug text-ink-soft/90 last:border-b-0"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + i * 0.07 }}
          >
            <span
              className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold"
              style={{
                color: star.core,
                background: `${star.glow}1f`,
                border: `1px solid ${star.glow}55`,
              }}
            >
              {i + 1}
            </span>
            <span>{renderRich(p, star.glow)}</span>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Navigation footer                                                           */
/* -------------------------------------------------------------------------- */

function NavFooter({
  star,
  index,
  isFirst,
  isLast,
  onPrev,
  onNext,
  onClose,
}: {
  star: StarData;
  index: number;
  isFirst: boolean;
  isLast: boolean;
  onPrev: () => void;
  onNext: () => void;
  onClose: () => void;
}) {
  return (
    <div className="sticky bottom-0 border-t border-white/10 bg-[#070710]/85 px-6 py-4 backdrop-blur-xl sm:px-8">
      <div className="mb-3 flex items-center gap-1.5">
        {STARS.map((s) => (
          <span
            key={s.id}
            className="h-1 flex-1 rounded-full transition-all duration-500"
            style={{
              background:
                s.index <= index ? star.glow : "rgba(255,255,255,0.12)",
            }}
          />
        ))}
      </div>
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onPrev}
          disabled={isFirst}
          className="rounded-full border border-white/15 px-4 py-2 text-[11px] uppercase tracking-[0.2em] text-ink-soft transition-colors enabled:hover:border-white/40 disabled:opacity-25"
        >
          Anterior
        </button>
        <span className="text-[11px] uppercase tracking-[0.25em] text-ink-faint">
          {index + 1} / {STARS.length}
        </span>
        {isLast ? (
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/15 px-4 py-2 text-[11px] uppercase tracking-[0.2em] text-ink-soft transition-colors hover:border-white/40"
          >
            Ver todo
          </button>
        ) : (
          <button
            type="button"
            onClick={onNext}
            className="rounded-full px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-bg-0 transition-transform hover:scale-[1.03]"
            style={{
              background: `linear-gradient(90deg, ${star.glow}, ${star.core})`,
            }}
          >
            Siguiente
          </button>
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Text helpers — purely presentational, the original text is preserved        */
/* -------------------------------------------------------------------------- */

/**
 * Split a paragraph into visual paragraphs of ~2 sentences for reading rhythm.
 * Only whitespace between sentences is re-inserted; every character of the
 * original text is preserved.
 */
function groupIntoParagraphs(text: string, perPara = 2): string[] {
  const sentences = text.split(/(?<=\.)\s+/).filter(Boolean);
  if (sentences.length <= 1) return [text];
  const paras: string[] = [];
  for (let i = 0; i < sentences.length; i += perPara) {
    paras.push(sentences.slice(i, i + perPara).join(" "));
  }
  return paras;
}

/**
 * Render inline **bold** markup as emphasized text. The asterisks are markup
 * (not content); the visible words are kept verbatim.
 */
function renderRich(text: string, accent: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) => {
    const m = part.match(/^\*\*([^*]+)\*\*$/);
    if (m) {
      return (
        <strong
          key={i}
          className="font-semibold"
          style={{ color: accent }}
        >
          {m[1]}
        </strong>
      );
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}
