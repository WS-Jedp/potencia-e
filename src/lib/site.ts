/** Public site configuration — used for metadata, OG tags, and sharing. */

const GITHUB_PAGES_URL = "https://ws-jedp.github.io/potencia-e";
const VERCEL_PRODUCTION_URL = "https://potencia-e.vercel.app";

export const siteConfig = {
  name: "Ignición",
  title: "Ignición · Potencia E y yo",
  shortTitle: "Ignición",
  description:
    "Experiencia estelar del Plan Celestial de Juan Esteban Deossa: de Sapzurro a la soberanía energética, forjando el futuro con Potencia E e Ingeniería Física en EAFIT.",
  tagline: "Potencia E y yo",
  author: "Juan Esteban Deossa",
  locale: "es_CO",
  ogImage: "/ignicion-potencia-e.png",
  ogImageAlt:
    "Ignición — experiencia estelar de Juan Esteban Deossa con Potencia E e Ingeniería Física en EAFIT",
  ogImageWidth: 2908,
  ogImageHeight: 1714,
  favicon: "/eafit-logo.webp",
  keywords: [
    "Potencia E",
    "EAFIT",
    "Ingeniería Física",
    "Juan Esteban Deossa",
    "Sapzurro",
    "soberanía energética",
    "Plan Celestial",
    "Ignición",
    "beca",
    "Medellín",
  ],
} as const;

/**
 * Stable public origin for metadata. Never use Vercel preview/deployment URLs
 * (e.g. potencia-xxx.vercel.app) — they are SSO-protected and break OG images
 * in WhatsApp, iMessage, LinkedIn, etc.
 */
export function getSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }

  if (process.env.GITHUB_PAGES === "true") {
    return GITHUB_PAGES_URL;
  }

  // Any Vercel deploy: use the stable production domain for metadata.
  // Preview URLs (potencia-xxx.vercel.app) are SSO-protected and break OG scrapers.
  if (process.env.VERCEL) {
    return VERCEL_PRODUCTION_URL;
  }

  return "http://localhost:3000";
}

/** Build an absolute URL for OG / canonical tags. */
export function absoluteUrl(path: string): string {
  const base = getSiteUrl();
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}
