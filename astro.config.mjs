// @ts-check
import { defineConfig } from "astro/config";
import { loadEnv } from "vite";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

/**
 * ⚠️ TODO (reemplazar antes de publicar): dominio real del sitio.
 *
 * Se configura mediante la variable de entorno `PUBLIC_SITE_URL`
 * (defínela en un archivo `.env` en la raíz o en el panel del proveedor
 * de despliegue). De esta única URL se derivan automáticamente:
 * `<link canonical>`, `og:url`, `og:image`, Twitter card, JSON-LD,
 * `robots.txt` y `sitemap-index.xml`.
 *
 * El valor por defecto es un placeholder claramente marcado:
 *   PUBLIC_SITE_URL=https://beatrizguirola.com
 *
 * Ver README.md → «Configurar el dominio».
 */
const { PUBLIC_SITE_URL } = loadEnv(process.env.NODE_ENV ?? "production", process.cwd(), "PUBLIC_");
const site = PUBLIC_SITE_URL ?? "https://beatrizguirola.com";

// https://astro.build/config
export default defineConfig({
  site,
  output: "static",
  // HTML minificado. Los estilos van en un CSS externo (nunca inline)
  // para que la CSP de `public/_headers` pueda ser estricta.
  compressHTML: true,
  build: {
    inlineStylesheets: "never",
  },
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
