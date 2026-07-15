import "$lib/telemetry/server-auto.js";
import { env } from "$env/dynamic/private";
import { sequence } from "@sveltejs/kit/hooks";
import type { Handle, HandleFetch } from "@sveltejs/kit";
import { getLogger } from "@logtape/logtape";
import { context, propagation, SpanKind, SpanStatusCode, trace } from "@opentelemetry/api";
import type { TextMapSetter } from "@opentelemetry/api";
import { paraglideMiddleware } from "$lib/paraglide/server";
import { getApiOrigin } from "$lib/config/public-url-config.js";
import { getServerApiOrigin, serverFetch } from "$lib/server/fetch-with-cf.js";
import { isGdprStrictCountry, normalizeCfCountry } from "$lib/geo/eu-countries.js";
import { normalizePathForTelemetry, parseUrlPatterns } from "$lib/telemetry/config.js";
import { isServerTelemetryEnabled } from "$lib/telemetry/server.js";
import type { AuthUser, AuthSession } from "@tcg/shared/auth";

const sessionLogger = getLogger(["tcg", "core-simulator", "session"]);
const ssrFetchTracer = trace.getTracer("lorcana-simulator-ssr-fetch");
const headersSetter: TextMapSetter<Headers> = {
  set(carrier, key, value) {
    carrier.set(key, value);
  },
};

const STATIC_PROBE_PATHS = new Set([
  "/.well-known/assetlinks.json",
  "/.well-known/traffic-advice",
  "/apple-touch-icon-precomposed.png",
  "/apple-touch-icon.png",
  "/app-ads.txt",
  "/favicon.ico",
  "/robots.txt",
  "/sitemaps.txt",
]);

const handleStaticProbe: Handle = ({ event, resolve }) => {
  if (STATIC_PROBE_PATHS.has(event.url.pathname)) {
    return new Response(null, {
      status: 204,
      headers: {
        "cache-control": "public, max-age=86400",
      },
    });
  }

  return resolve(event);
};

const handleParaglide: Handle = ({ event, resolve }) =>
  paraglideMiddleware(
    event.request,
    ({ request, locale }: { request: Request; locale: string }) => {
      event.request = request;

      return resolve(event, {
        transformPageChunk: ({ html }) =>
          html.replace("%lang%", locale).replace("%dir%", getDirection(locale)),
      });
    },
  );

function getDirection(locale: string): "ltr" | "rtl" {
  return locale.startsWith("ar") ? "rtl" : "ltr";
}

/**
 * Resolve the Better Auth session server-side by forwarding the cookie to the API.
 * Populates event.locals.user and event.locals.session for all downstream load functions.
 */
const handleSession: Handle = async ({ event, resolve }) => {
  event.locals.user = null;
  event.locals.session = null;

  const cookie = event.request.headers.get("cookie");
  if (!cookie) {
    return resolve(event);
  }

  try {
    const apiOrigin = getServerApiOrigin(getApiOrigin());
    const res = await serverFetch(`${apiOrigin}/api/auth/get-session`, {
      headers: { cookie },
    });

    if (res.ok) {
      const data = (await res.json()) as { user: AuthUser; session: AuthSession } | null;
      if (data?.user && data?.session) {
        event.locals.user = data.user;
        event.locals.session = data.session;
      }
    } else {
      sessionLogger.warn("getSession request failed status={status} statusText={statusText}", {
        status: res.status,
        statusText: res.statusText,
      });
    }
  } catch (error) {
    // Continue as anonymous, but surface the failure so API outages are visible
    sessionLogger.warn("getSession request threw error={error}", {
      error: error instanceof Error ? error.message : String(error),
    });
  }

  return resolve(event);
};

/**
 * Resolve visitor geolocation from Cloudflare's `cf-ipcountry` header so the
 * client can apply GDPR-strict consent defaults for EU/EEA/UK visitors.
 *
 * Fail-closed posture: when the header is absent or unparseable (local dev,
 * direct origin hits, Cloudflare sentinels like `XX`/`T1`), `country` is null
 * AND `gdprStrict` is true. Treating unknowns as strict avoids leaking GA4
 * events to a user whose jurisdiction we can't determine.
 */
const handleGeo: Handle = ({ event, resolve }) => {
  const country = normalizeCfCountry(event.request.headers.get("cf-ipcountry"));
  event.locals.country = country;
  event.locals.gdprStrict = country == null ? true : isGdprStrictCountry(country);
  return resolve(event);
};

export const handle: Handle = sequence(
  handleStaticProbe,
  handleParaglide,
  handleGeo,
  handleSession,
);

export function patternMatchesUrl(pattern: string | RegExp, url: URL): boolean {
  if (pattern instanceof RegExp) return pattern.test(url.href);
  try {
    const allowed = new URL(pattern);
    if (url.origin !== allowed.origin) return false;
    if (allowed.pathname === "/" && !allowed.search) return true;
    const allowedPath = allowed.pathname.endsWith("/") ? allowed.pathname : `${allowed.pathname}/`;
    return url.pathname === allowed.pathname || url.pathname.startsWith(allowedPath);
  } catch {
    return url.href === pattern;
  }
}

function shouldPropagateServerTrace(url: URL): boolean {
  const apiOrigin = getApiOrigin();
  const serverApiOrigin = getServerApiOrigin(apiOrigin);
  const allowedOrigins = new Set(
    [apiOrigin, serverApiOrigin].flatMap((origin) => {
      try {
        return [new URL(origin).origin];
      } catch {
        return [];
      }
    }),
  );

  if (allowedOrigins.has(url.origin)) return true;

  return parseUrlPatterns(env.OTEL_PROPAGATE_TRACE_URLS).some((pattern) =>
    patternMatchesUrl(pattern, url),
  );
}

export const handleFetch: HandleFetch = async ({ request, fetch }) => {
  if (!isServerTelemetryEnabled()) {
    return fetch(request);
  }

  const url = new URL(request.url);
  const normalizedPath = normalizePathForTelemetry(url.pathname);
  const sanitizedUrl = `${url.origin}${normalizedPath}`;
  const span = ssrFetchTracer.startSpan(`SSR ${request.method} ${normalizedPath}`, {
    kind: SpanKind.CLIENT,
    attributes: {
      "http.request.method": request.method,
      "url.full": sanitizedUrl,
      "url.path": normalizedPath,
      "server.address": url.hostname,
      "tcg.ssr_fetch": true,
    },
  });
  const activeContext = trace.setSpan(context.active(), span);
  const headers = new Headers(request.headers);
  if (shouldPropagateServerTrace(url)) {
    propagation.inject(activeContext, headers, headersSetter);
  }
  const tracedRequest = new Request(request, { headers });

  try {
    return await context.with(activeContext, async () => {
      const response = await fetch(tracedRequest);
      span.setAttribute("http.response.status_code", response.status);
      if (response.status >= 500) {
        span.setStatus({ code: SpanStatusCode.ERROR, message: response.statusText });
      }
      // Streaming response bodies are not wrapped; this span covers request dispatch
      // and response headers, not full downstream stream consumption.
      return response;
    });
  } catch (error) {
    span.recordException(error instanceof Error ? error : new Error(String(error)));
    span.setStatus({
      code: SpanStatusCode.ERROR,
      message: error instanceof Error ? error.message : String(error),
    });
    throw error;
  } finally {
    span.end();
  }
};
