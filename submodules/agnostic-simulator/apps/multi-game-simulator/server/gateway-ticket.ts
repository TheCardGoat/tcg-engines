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
  requireAuth?: boolean;
  fetcher?: typeof fetch;
}

export type GatewayTicketBootstrapResult =
  | { status: "ready"; ticket: GatewayTicket }
  | { status: "anonymous_allowed"; reason: "no_game_api" | "not_required" }
  | {
      status: "ticket_failed";
      reason: "http_error" | "request_failed" | "missing_credentials" | "parse_failed";
      httpStatus?: number;
      errorCode?: string;
    };

class GatewayTicketHttpError extends Error {
  readonly status: number;

  constructor(status: number) {
    super("Gateway ticket request failed");
    this.name = "GatewayTicketHttpError";
    this.status = status;
  }
}

/**
 * Resolve a gateway ticket + JWT for the active game namespace, forwarding the
 * browser session cookie to the per-game ticket endpoint. Required-auth callers
 * get structured failures instead of silently downgrading to anonymous.
 */
export async function resolveGatewayTicket({
  request,
  gameSlug,
  matchId,
  playerId,
  requireAuth = false,
  fetcher = fetch,
}: ResolveGatewayTicketOptions): Promise<GatewayTicketBootstrapResult> {
  if (!gameSlug || !isGameApiSlug(gameSlug)) {
    const result = { status: "anonymous_allowed", reason: "no_game_api" } as const;
    logGatewayTicketResult(result);
    return result;
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
    const ticket = await requestGatewayTicket({
      apiBaseUrl,
      ...(matchId ? { matchId } : {}),
      ...(playerId ? { playerId } : {}),
      fetcher: forwardingFetcher,
      createHttpError: async (response) => new GatewayTicketHttpError(response.status),
    });
    logGatewayTicketResult({
      status: "ready",
      hasTicket: Boolean(ticket.ticket),
      hasAuthToken: Boolean(ticket.authToken),
      hasCookie: Boolean(cookieHeader),
      requireAuth,
      hasMatchId: Boolean(matchId),
      hasPlayerId: Boolean(playerId),
    });
    return { status: "ready", ticket };
  } catch (error) {
    const httpStatus = error instanceof GatewayTicketHttpError ? error.status : undefined;
    const reason =
      httpStatus === 401 || httpStatus === 403
        ? "missing_credentials"
        : httpStatus
          ? "http_error"
          : error instanceof SyntaxError
            ? "parse_failed"
            : "request_failed";
    const diagnostic = {
      status: requireAuth ? "ticket_failed" : "anonymous_allowed",
      reason,
      ...(httpStatus ? { httpStatus } : {}),
      errorCode: error instanceof Error ? error.name : typeof error,
      hasCookie: Boolean(cookieHeader),
      requireAuth,
      hasMatchId: Boolean(matchId),
      hasPlayerId: Boolean(playerId),
    } as const;
    logGatewayTicketResult(diagnostic);
    return requireAuth
      ? {
          status: "ticket_failed",
          reason,
          ...(httpStatus ? { httpStatus } : {}),
          errorCode: error instanceof Error ? error.name : typeof error,
        }
      : { status: "anonymous_allowed", reason: "not_required" };
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

function logGatewayTicketResult(details: Record<string, unknown>): void {
  console.info("[simulator-auth] gateway ticket bootstrap", details);
}
