/**
 * Genera los iconos del sitio a partir de la marca (misma que public/favicon.svg):
 *   - public/favicon.ico        (16, 32 y 48 px en un contenedor ICO)
 *   - public/apple-touch-icon.png (180×180)
 *   - public/icon-192.png       (192×192)
 *   - public/icon-512.png       (512×512)
 *
 * Uso: npm run icons
 */
import { writeFile } from "node:fs/promises";
import sharp from "sharp";

const ACCENT = "#C2512F"; // ⚠️ mantener en sincronía con --color-accent (ver README)

/** Marca del sitio. Versión de esquinas cuadradas para iconos de app (iOS/touch). */
function markSvg({ rounded }) {
  const rect = rounded ? `<rect width="64" height="64" rx="12" fill="${ACCENT}"/>` : `<rect width="64" height="64" fill="${ACCENT}"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">${rect}<g fill="none" stroke="#FFFFFF" stroke-width="5" stroke-linecap="square"><rect x="16" y="16" width="32" height="32"/><path d="M16 32h32"/><path d="M32 16v16"/></g></svg>`;
}

/** Rasteriza la marca al tamaño exacto (nítido, sin reescalado). */
async function renderPng(size) {
  // densidad = DPI necesario para que el viewBox de 64px se rasterice a `size`
  return sharp(Buffer.from(markSvg({ rounded: false })), { density: (size / 64) * 72 })
    .resize(size, size)
    .png({ compressionLevel: 9, palette: true })
    .toBuffer();
}

/** ICO multipágina con PNGs embebidos (formato soportado por todos los navegadores). */
function buildIco(pngs) {
  const count = pngs.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reservado
  header.writeUInt16LE(1, 2); // tipo: icono
  header.writeUInt16LE(count, 4);

  const entries = [];
  const blobs = [];
  let offset = 6 + count * 16;

  for (const { size, data } of pngs) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size >= 256 ? 0 : size, 0);
    entry.writeUInt8(size >= 256 ? 0 : size, 1);
    entry.writeUInt8(0, 2); // colores
    entry.writeUInt8(0, 3); // reservado
    entry.writeUInt16LE(1, 4); // planos
    entry.writeUInt16LE(32, 6); // bits por píxel
    entry.writeUInt32LE(data.length, 8);
    entry.writeUInt32LE(offset, 12);
    entries.push(entry);
    blobs.push(data);
    offset += data.length;
  }

  return Buffer.concat([header, ...entries, ...blobs]);
}

const sizes = [16, 32, 48];
const pngs = [];
for (const size of sizes) {
  pngs.push({ size, data: await renderPng(size) });
}

await writeFile("public/favicon.ico", buildIco(pngs));
console.log("✓ public/favicon.ico (16, 32, 48)");

for (const size of [180, 192, 512]) {
  const name = size === 180 ? "public/apple-touch-icon.png" : `public/icon-${size}.png`;
  await writeFile(name, await renderPng(size));
  console.log(`✓ ${name} (${size}×${size})`);
}
