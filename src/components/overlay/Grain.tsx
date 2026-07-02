/**
 * Layered, animated film-grain / noise overlay for cinematic texture.
 * Purely decorative and non-interactive; styles live in globals.css.
 */
export function Grain() {
  return (
    <div className="grain-root" aria-hidden>
      <div className="grain-layer grain-coarse" />
      <div className="grain-layer grain-fine" />
      <div className="grain-flicker" />
    </div>
  );
}
