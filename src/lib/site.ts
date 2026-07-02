/** Public site configuration — used for metadata, OG tags, and sharing. */

const PRODUCTION_URL = "https://ws-jedp.github.io/potencia-e";

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

/** Absolute site URL — must match the deployed origin for OG images to resolve. */
export function getSiteUrl(): string {
  if (process.env.GITHUB_PAGES === "true") return PRODUCTION_URL;
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}
