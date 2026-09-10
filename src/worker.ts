interface Env {
  ASSETS: Fetcher;
}

const CANONICAL_HOST = 'wearableroboticexoskeletons.com';

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

    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
