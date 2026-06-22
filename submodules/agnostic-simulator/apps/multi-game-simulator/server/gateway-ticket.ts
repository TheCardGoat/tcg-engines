import type { PlayableGameSlug } from "@tcg/protocol";
import { requestGatewayTicket, type GatewayTicket } from "@tcg/simulator-runtime/gateway";

/**
 * Server-side gateway ticket resolver.
 *
 * Mirrors {@link resolvePlatformAuthSession}: it forwards the browser cookie
 * plus `x-forwarded-host`/`x-forwarded-proto` to the per-game gateway ticket
 * endpoint so a logged-in user's session mints an authenticated ticket during
 * SSR. The library (`@tcg/gateway-client`) never performs this fetch — it only
 * receives the resolved `{ ticket, token }` via `setCredentials`.
 */

/**
 * Per-game runtime API origins. Kept in sync with
 * `src/runtime/gameRuntimeApi.ts`'s `PRODUCTION_GAME_RUNTIME_API_ORIGINS` but
 * resolved from `process.env` (the server bundle convention — see
 * `auth-session.ts`) rather than `import.meta.env`.
 */
const PRODUCTION_GAME_RUNTIME_API_ORIGINS = {
  cyberpunk: "https://cyberpunk-api.tcg.online",
  gundam: "https://gundam-api.tcg.online",
  lorcana: "https://lorcana-api.tcg.online",
  "one-piece": "https://one-piece-api.tcg.online",
} as const;

type GameApiSlug = keyof typeof PRODUCTION_GAME_RUNTIME_API_ORIGINS;

/** Slugs that own a gateway namespace + ticket endpoint. */
const GAME_API_SLUGS = new Set<string>(Object.keys(PRODUCTION_GAME_RUNTIME_API_ORIGINS));

function isGameApiSlug(slug: string): slug is GameApiSlug {
  return GAME_API_SLUGS.has(slug);
}

/** Upper bound on the SSR ticket fetch so a slow gateway cannot stall SSR. */
const GATEWAY_TICKET_FETCH_TIMEOUT_MS = 8_000;

export interface ResolveGatewayTicketOptions {
  request: Request;
  gameSlug: PlayableGameSlug | null;
  matchId?: string;
  playerId?: string;
  fetcher?: typeof fetch;
}

/**
 * Resolve a gateway ticket + JWT for the active game namespace, forwarding the
 * browser session cookie to the per-game ticket endpoint. Returns `null` for
 * non-game slugs, anonymous requests, or any fetch failure (the client falls
 * back to an anonymous connect via the gateway-client library).
 */
export async function resolveGatewayTicket({
  request,
  gameSlug,
  matchId,
  playerId,
  fetcher = fetch,
}: ResolveGatewayTicketOptions): Promise<GatewayTicket | null> {
  if (!gameSlug || !isGameApiSlug(gameSlug)) {
    return null;
  }

  const url = new URL(request.url);
  const apiBaseUrl = getServerGameApiBaseUrl(gameSlug);

  // Forward the cookie + forwarded-host/proto exactly like the auth-session
  // resolver so the gateway attributes the ticket to the user's session.
  const cookieHeader = request.headers.get("cookie") ?? "";
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), GATEWAY_TICKET_FETCH_TIMEOUT_MS);

  const forwardingFetcher: typeof fetch = (input, init) => {
    const headers = new Headers(init?.headers);
    if (cookieHeader) {
      headers.set("cookie", cookieHeader);
    }
    headers.set("x-forwarded-host", url.host);
    headers.set("x-forwarded-proto", url.protocol.replace(":", ""));
    return fetcher(input, { ...init, headers, signal: controller.signal });
  };

  try {
    return await requestGatewayTicket({
      apiBaseUrl,
      ...(matchId ? { matchId } : {}),
      ...(playerId ? { playerId } : {}),
      fetcher: forwardingFetcher,
    });
  } catch {
    // Anonymous/down: the client connects anonymously via the library.
    return null;
  } finally {
    clearTimeout(timer);
  }
}

function getServerGameApiBaseUrl(slug: GameApiSlug): string {
  const runtimeUrls = parseRuntimeApiUrlMap(process.env.VITE_GAME_RUNTIME_API_URLS);
  const base =
    runtimeUrls[slug] ?? PRODUCTION_GAME_RUNTIME_API_ORIGINS[slug] ?? process.env.VITE_API_URL;
  return normalizeApiBase(base);
}

/** Mirrors `parseRuntimeApiUrlMap` in `src/runtime/gameRuntimeApi.ts`. */
function parseRuntimeApiUrlMap(value: string | undefined): Record<string, string> {
  const trimmed = value?.trim();
  if (!trimmed) {
    return {};
  }
  try {
    const parsed = JSON.parse(trimmed) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return {};
    }
    return Object.fromEntries(
      Object.entries(parsed).filter(
        (entry): entry is [string, string] =>
          typeof entry[0] === "string" && typeof entry[1] === "string" && entry[1].trim() !== "",
      ),
    );
  } catch {
    return {};
  }
}

/** Mirrors `normalizeApiBase` in `src/runtime/gameRuntimeApi.ts`. */
function normalizeApiBase(value: string | undefined): string {
  const trimmed = value?.trim();
  if (!trimmed) {
    return "";
  }
  return trimmed.replace(/\/v1\/?$/i, "").replace(/\/$/, "");
}
