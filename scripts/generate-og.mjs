/**
 * Genera public/og-image.png (1200×630, <300 KB) con satori + sharp.
 *
 * Reproduce la cabecera del CV: bloque de color de acento con cuadrícula
 * tenue de "plano", el nombre en Montserrat Black enorme y el cargo
 * "Arquitecta y Urbanista" con tracking, igual que el sitio.
 *
 * Uso: npm run og
 */
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import satori from "satori";

const ACCENT = "#C2512F"; // ⚠️ mantener en sincronía con --color-accent (ver README)
const WHITE = "#FFFFFF";
const WIDTH = 1200;
const HEIGHT = 630;

/** Carga una fuente autoalojada de @fontsource (woff local, nada de CDN). */
async function loadFont(weight) {
  // satori no admite woff2; @fontsource también empaqueta .woff
  const path = fileURLToPath(
    new URL(`../node_modules/@fontsource/montserrat/files/montserrat-latin-${weight}-normal.woff`, import.meta.url),
  );
  return { name: "Montserrat", data: await readFile(path), weight, style: "normal" };
}

const fonts = await Promise.all([loadFont(900), loadFont(600)]);

/** Cuadrícula tenue de "plano arquitectónico" (líneas verticales white 4%). */
const gridLines = Array.from({ length: 15 }, (_, i) => ({
  type: "div",
  props: {
    style: {
      position: "absolute",
      left: `${i * 80}px`,
      top: 0,
      width: "1px",
      height: "100%",
      backgroundColor: "rgba(255, 255, 255, 0.05)",
    },
  },
}));

const element = {
  type: "div",
  props: {
    style: {
      width: WIDTH,
      height: HEIGHT,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      position: "relative",
      backgroundColor: ACCENT,
      padding: "110px 96px",
      fontFamily: "Montserrat",
    },
    children: [
      ...gridLines,

      // Marco fino de "plano" (bloque de título)
      {
        type: "div",
        props: {
          style: {
            position: "absolute",
            top: "28px",
            left: "28px",
            right: "28px",
            bottom: "28px",
            border: `2px solid rgba(255, 255, 255, 0.5)`,
          },
        },
      },

      // Contenido
      {
        type: "div",
        props: {
          style: { display: "flex", flexDirection: "column", alignItems: "flex-start" },
          children: [
            {
              type: "div",
              props: {
                style: {
                  fontSize: "25px",
                  fontWeight: 600,
                  letterSpacing: "9px",
                  color: "rgba(255, 255, 255, 0.85)",
                  textTransform: "uppercase",
                  marginBottom: "28px",
                },
                children: "Ciego de Ávila · Cuba",
              },
            },
            {
              type: "div",
              props: {
                style: {
                  fontSize: "108px",
                  fontWeight: 900,
                  lineHeight: 1.04,
                  letterSpacing: "-2px",
                  color: WHITE,
                },
                children: ["Beatriz Yuliet", "Guirola Alvarado"],
              },
            },
            {
              type: "div",
              props: {
                style: {
                  width: "96px",
                  height: "6px",
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  marginTop: "36px",
                  marginBottom: "34px",
                },
              },
            },
            {
              type: "div",
              props: {
                style: {
                  fontSize: "36px",
                  fontWeight: 600,
                  letterSpacing: "12px",
                  color: WHITE,
                  textTransform: "uppercase",
                },
                children: "Arquitecta y Urbanista",
              },
            },
          ],
        },
      },
    ],
  },
};

const svg = await satori(element, { width: WIDTH, height: HEIGHT, fonts });

const png = await sharp(Buffer.from(svg))
  .png({ compressionLevel: 9, palette: true, quality: 90 })
  .toBuffer();

await writeFile("public/og-image.png", png);

const kb = png.length / 1024;
if (kb > 300) {
  throw new Error(`og-image.png supera 300 KB (${kb.toFixed(1)} KB)`);
}
console.log(`✓ public/og-image.png (${WIDTH}×${HEIGHT}, ${kb.toFixed(1)} KB)`);
