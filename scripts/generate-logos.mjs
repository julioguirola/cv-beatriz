/**
 * Genera los SVG monocromos de software como módulo TypeScript
 * (`src/data/logos.ts`), para incrustarlos inline en la página.
 *
 * Fuente: paquete `simple-icons` (licencia CC0), renderizados con
 * `fill="currentColor"` para heredar el color de texto (monocromo grafito).
 * Si un logo oficial no está disponible (Photoshop, Lumion), se crea un
 * sustituto limpio y coherente: cuadrado redondeado con las iniciales.
 *
 * Uso: npm run logos
 */
import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import * as icons from "simple-icons";

const OUT = fileURLToPath(new URL("../src/data/logos.ts", import.meta.url));

/** Busca un icono de simple-icons por su slug (p. ej. "autocad" → "siAutocad"). */
function findIcon(slug) {
  const key = "si" + slug.replaceAll(/(^|-)([a-z])/g, (_, __, c) => c.toUpperCase());
  return icons[key] ?? null;
}

/** SVG monocromo a partir de un icono oficial de simple-icons (decorativo, sin título). */
function brandSvg(icon) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" role="img" aria-hidden="true"><path d="${icon.path}"/></svg>`;
}

/**
 * Sustituto monocromo: cuadrado redondeado con las iniciales del programa.
 * Mismo peso visual y caja de 24×24 que los logos oficiales.
 * (El texto se renderiza con Montserrat, cargada en la página al incrustarse inline.)
 */
function monogramSvg(initials) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" role="img" aria-hidden="true"><rect x="1.75" y="1.75" width="20.5" height="20.5" rx="5" stroke="currentColor" stroke-width="2"/><text x="12" y="12.6" text-anchor="middle" dominant-baseline="middle" font-family="Montserrat, Roboto, sans-serif" font-size="8.5" font-weight="700" letter-spacing="0.02em" fill="currentColor">${initials}</text></svg>`;
}

// slug: icono oficial en simple-icons | null: usar monograma con iniciales
const LOGOS = [
  { key: "autocad", slug: "autocad", initials: "Ac" },
  { key: "revit", slug: "autodeskrevit", initials: "Rv" },
  { key: "sketchup", slug: "sketchup", initials: "Sk" },
  { key: "photoshop", slug: null, initials: "Ps" }, // Adobe no publica icono con licencia clara
  { key: "lumion", slug: null, initials: "Lu" }, // Lumion no está en simple-icons
  { key: "whatsapp", slug: "whatsapp", initials: "Wa" }, // usado en botones de contacto
];

const entries = [];
for (const { key, slug, initials } of LOGOS) {
  const icon = slug ? findIcon(slug) : null;
  const svg = icon ? brandSvg(icon) : monogramSvg(initials);
  entries.push(`  ${key}: ${JSON.stringify(svg)},`);
  console.log(`✓ ${key} ${icon ? `(oficial: ${icon.title})` : "(monograma sustituto)"}`);
}

const module_ = `/**
 * ⚠️ ARCHIVO GENERADO automáticamente por scripts/generate-logos.mjs (npm run logos).
 * Logos monocromos incrustados (24×24, color heredado vía currentColor).
 * No editar a mano: ejecutar el script para regenerar.
 */
export const logos: Record<string, string> = {
${entries.join("\n")}
};
`;

await writeFile(OUT, module_, "utf8");
console.log(`→ ${OUT}`);
