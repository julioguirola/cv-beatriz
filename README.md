# CV — Beatriz Yuliet Guirola Alvarado · Arquitecta y Urbanista

Landing page de una sola página que funciona como Curriculum Vitae. Estilo
minimalista y arquitectónico: escala de grises pura con un único acento
terracota, tipografía Montserrat (display) y Roboto (cuerpo), retícula de
12 columnas y mucho espacio en blanco.

Construida con **Astro** (salida estática, cero JS de framework), **Tailwind CSS 4**,
fuentes autoalojadas con **@fontsource**, TypeScript estricto y todo el contenido
editable en un único archivo de datos (`src/data/cv.ts`).

## Requisitos

- Node.js ≥ 22.12
- npm (el proyecto incluye `package-lock.json`)

## Ejecutar

```bash
npm install
npm run dev      # servidor de desarrollo → http://localhost:4321
npm run build    # build de producción → dist/
npm run preview  # sirve el build local
npm run check    # verificación de tipos (TypeScript estricto)
```

## Estructura del proyecto

```
src/
  data/cv.ts               # ⭐ TODO el contenido editable del CV (tipado)
  data/logos.ts            # (generado) logos monocromos incrustados
  layouts/Layout.astro     # <head> completo: SEO, OG, Twitter, JSON-LD, fuentes
  components/
    Header.astro           # bloque de acento: nombre, cargo y botones de acción
    Contact.astro          # teléfono, email, WhatsApp y ubicación (<address>)
    Languages.astro        # idiomas con indicador de puntos
    SoftwareList.astro      # logos monocromos + nivel 1–5 accesible
    SoftSkills.astro        # píldoras de habilidades personales
    Timeline.astro          # línea de tiempo reutilizable (experiencia/estudios)
    HardSkills.astro        # habilidades técnicas en 2 columnas
    HandArrow.astro         # flecha decorativa de trazo a mano
    Footer.astro
  pages/index.astro        # la página
  pages/robots.txt.ts     # robots.txt generado con el dominio configurado
  styles/global.css        # tokens de diseño, animaciones accesibles e impresión
public/
  favicon.svg · favicon.ico · apple-touch-icon.png · icon-192.png · icon-512.png
  site.webmanifest · og-image.png · _headers
  scripts/reveal.js        # micro-JS de animación de entrada (IntersectionObserver)
scripts/
  generate-og.mjs          # regenera public/og-image.png (satori + sharp)
  generate-icons.mjs       # regenera favicons e iconos PWA (sharp)
  generate-logos.mjs       # regenera src/data/logos.ts (simple-icons)
astro.config.mjs
```

## Editar el contenido

Todo el contenido vive en **`src/data/cv.ts`**, separado del markup y con tipos
(TypeScript estricto). Cambia ahí:

- Nombre, cargo, teléfono, email, ubicación y enlaces.
- Idiomas y niveles (escala 1–5).
- Experiencia y estudios (cada hito: `title`, `org`, `period`, `current`).
- Habilidades técnicas y personales.
- **Niveles de software**: están marcados con `// AJUSTAR niveles reales`.
  Cada programa tiene `level` del 1 al 5 (rellena los puntos) y una clave `logo`.
  Para añadir un programa: añade una entrada con `logo` existente o un monograma
  (`initials`) y ejecuta `npm run logos` si quieres un icono oficial nuevo
  (debe existir en [simple-icons](https://simple-icons.com)).

## Cambiar el color de acento

El único color de la paleta fuera de la escala de grises se define **en un solo
lugar del CSS**: la variable `--color-accent` (con alias `--accent`) en
`src/styles/global.css`.

```css
@theme {
  --color-accent: #c2512f; /* cámbialo aquí */
}
```

Para mantener la coherencia (tema del navegador, manifest, imagen OG e iconos),
actualiza también el mismo hex en los sitios marcados con el comentario
`⚠️ mantener en sincronía`:

| Archivo                            | Uso                          |
| ---------------------------------- | ---------------------------- |
| `src/styles/global.css`            | token `--color-accent` (CSS) |
| `src/layouts/Layout.astro`         | `<meta name="theme-color">`  |
| `public/site.webmanifest`          | `theme_color`                |
| `scripts/generate-og.mjs`          | fondo de la imagen OG        |
| `scripts/generate-icons.mjs`       | fondo de los iconos          |
| `public/favicon.svg`               | fondo de la marca            |

Tras cambiarlo, regenera los assets: `npm run og && npm run icons`.

> El texto blanco sobre el acento debe mantener un contraste ≥ 4.5:1 (WCAG AA).
> `#C2512F` da 4.65:1 con blanco. Si cambias el acento, verifica el contraste
> (p. ej. con la calculadora oficial de WCAG).

## Configurar el dominio (importante para SEO)

El dominio se configura con la variable de entorno **`PUBLIC_SITE_URL`**.
De ella se derivan automáticamente: `<link canonical>`, `og:url`, `og:image`,
las URLs absolutas de la tarjeta de Twitter, el JSON-LD, `robots.txt` y el
sitemap.

Crea un archivo `.env` en la raíz (o defínela en el panel de tu proveedor):

```
PUBLIC_SITE_URL=https://www.tudominio.com
```

Si no se define, se usa el valor por defecto marcado en `astro.config.mjs`
(`https://beatrizguirola.com`, un placeholder que debes reemplazar antes de
publicar).

## Regenerar la imagen OG y los iconos

```bash
npm run og      # public/og-image.png (1200×630, satori + sharp)
npm run icons   # favicon.ico, apple-touch-icon, icon-192, icon-512
npm run logos   # src/data/logos.ts (logos monocromos de software)
```

La imagen OG reproduce la cabecera del sitio (bloque de acento, nombre en
Montserrat Black, cargo) y pesa ~15 KB, muy por debajo del límite de 300 KB.

## Despliegue

El sitio es 100 % estático (`dist/`), sin funciones ni runtime.

### Netlify

1. Repo → «Add new site» → «Import an existing project».
2. Build command: `npm run build` · Publish directory: `dist`.
3. Añade la variable de entorno `PUBLIC_SITE_URL` con tu dominio.
4. Domain management → añade tu dominio y activa HTTPS.

Las cabeceras de seguridad y caché de `public/_headers` se aplican solas.

### Vercel

1. Importa el repo (Vercel detecta Astro automáticamente).
2. Añade `PUBLIC_SITE_URL` en Environment Variables.
3. Añade tu dominio en Settings → Domains.

> `public/_headers` es formato Netlify/Cloudflare. En Vercel, replica las
> cabeceras en `vercel.json` si las necesitas (no es imprescindible).

### Cloudflare Pages

1. Workers & Pages → Create → Pages → Connect to Git.
2. Build command: `npm run build` · Build output directory: `dist`.
3. Variable `PUBLIC_SITE_URL` en Settings → Variables.
4. `public/_headers` se aplica automáticamente.

### GitHub Pages

1. Settings → Pages → Source: **GitHub Actions**.
2. Añade `PUBLIC_SITE_URL=https://<usuario>.github.io` (o tu dominio) como
   variable del workflow.
3. Crea `.github/workflows/deploy.yml`:

```yaml
name: Deploy CV a GitHub Pages
on:
  push:
    branches: [main]
  workflow_dispatch:
permissions:
  contents: read
  pages: write
  id-token: write
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run build
        env:
          PUBLIC_SITE_URL: https://<usuario>.github.io
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

## SEO incluido

- `<title>` y `<meta description>` optimizados en español.
- Canonical, `hreflang` (es + x-default), `robots: index, follow, max-image-preview:large`.
- Open Graph completo (`og:profile` con nombre/apellido, imagen 1200×630 con
  dimensiones, tipo y alt) y Twitter `summary_large_image`.
- JSON-LD (`Person` + `WebSite` + `ProfilePage`) con formación, empleo, idiomas
  y habilidades.
- `sitemap-index.xml` (`@astrojs/sitemap`) y `robots.txt` con `Sitemap:` absoluto.
- HTML semántico: un solo `<h1>`, secciones con `aria-labelledby`, `<address>`,
  skip link, favicons y manifest PWA.
- Fuentes autoalojadas (@fontsource) con precarga de la fuente del nombre.

## Accesibilidad y rendimiento

- Objetivo WCAG 2.1 AA: contraste verificado, foco visible (anillo de acento),
  navegación completa por teclado, `prefers-reduced-motion` respetado
  (las animaciones se desactivan).
- Cero JS de framework: solo un módulo de ~1 KB para las animaciones de entrada.
- Estilos de impresión: el CV sale en blanco y negro, en una página A4 con la
  estructura de dos columnas (Ctrl/Cmd + P → «Guardar como PDF»).
