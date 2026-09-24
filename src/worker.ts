/// <reference types="@cloudflare/workers-types" />

interface Env {
  ASSETS: Fetcher;
  SITE_URL?: string;
}

const CANONICAL_HOST = 'wearableroboticexoskeletons.com';
const CANONICAL_ORIGIN = `https://${CANONICAL_HOST}`;

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    let needsRedirect = false;

    // Collapse www + http into one hop to the canonical HTTPS apex host
    if (url.hostname === `www.${CANONICAL_HOST}`) {
      url.hostname = CANONICAL_HOST;
      needsRedirect = true;
    }

    if (url.protocol !== 'https:') {
      url.protocol = 'https:';
      needsRedirect = true;
    }

    // Fold /index.html into / in the same redirect (avoids www/http → index.html → / chains)
    if (url.pathname === '/index.html' || url.pathname === '/index.htm') {
      url.pathname = '/';
      needsRedirect = true;
    }

    // Help crawlers that guess /sitemap.xml
    if (url.pathname === '/sitemap.xml') {
      url.pathname = '/sitemap-index.xml';
      needsRedirect = true;
    }

    if (needsRedirect) {
      return Response.redirect(url.toString(), 301);
    }

    const response = await env.ASSETS.fetch(request);
    const contentType = response.headers.get('Content-Type') ?? '';
    const headers = new Headers(response.headers);

    // Soft-404s and real 404s must never be indexed
    if (response.status === 404 || response.status === 410) {
      headers.set('X-Robots-Tag', 'noindex, nofollow');
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers,
      });
    }

    // Reinforce the preferred canonical at the edge (GSC duplicate-without-canonical fixes)
    if (response.status === 200 && contentType.includes('text/html')) {
      const path = url.pathname === '' ? '/' : url.pathname;
      const canonical =
        path === '/'
          ? `${CANONICAL_ORIGIN}/`
          : `${CANONICAL_ORIGIN}${path.endsWith('/') ? path : `${path}/`}`;
      headers.set('Link', `<${canonical}>; rel="canonical"`);
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers,
      });
    }

    return response;
  },
} satisfies ExportedHandler<Env>;
