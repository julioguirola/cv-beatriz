import type { APIRoute } from "astro";

/**
 * robots.txt generado en build a partir del `site` configurado
 * (PUBLIC_SITE_URL), de modo que `Sitemap:` siempre apunta a la URL absoluta
 * correcta sin mantener el archivo a mano.
 */
export const GET: APIRoute = ({ site }) => {
  const base = site ?? new URL("https://beatrizguirola.com");
  const sitemap = new URL("sitemap-index.xml", base).href;

  const body = ["User-agent: *", "Allow: /", "", `Sitemap: ${sitemap}`, ""].join("\n");

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
