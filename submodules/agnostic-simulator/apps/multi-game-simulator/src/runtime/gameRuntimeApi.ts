import type { GameSlug } from "@tcg/simulator-contract";
import { normalizeOrigin } from "@tcg/simulator-runtime/gateway";

const SERVER_INTERNAL_RUNTIME_ONLY = Symbol("server-internal-runtime-only");

export type RuntimeApiEnv = Record<string, string | undefined> & {
  [SERVER_INTERNAL_RUNTIME_ONLY]?: true;
};

export function runtimeApiEnvForServer(env: RuntimeApiEnv): RuntimeApiEnv {
  const internalRuntimeUrls = env.GAME_RUNTIME_API_INTERNAL_URLS?.trim();
  const developmentRuntimeUrls =
    env.NODE_ENV === "production" ? undefined : env.VITE_GAME_RUNTIME_API_URLS?.trim();
  return {
    ...env,
    VITE_GAME_RUNTIME_API_URLS: internalRuntimeUrls || developmentRuntimeUrls,
    [SERVER_INTERNAL_RUNTIME_ONLY]: true,
  };
}

/**
 * Production runtime API origins.
 *
 * The platform consolidated to a single General API deployment that serves
 * every game runtime from `https://api.tcg.online`, scoped by the game slug in
 * the URL path (`/v1/games/:gameSlug/...`). Every slug therefore resolves to
 * the same origin; the slug only selects the path-scoped runtime context.
 */
const PUBLIC_PRODUCTION_GAME_RUNTIME_API_ORIGINS: Record<GameSlug, string> = {
  platform: "https://api.tcg.online",
  cyberpunk: "https://api.tcg.online",
  gundam: "https://api.tcg.online",
  lorcana: "https://api.tcg.online",
  "one-piece": "https://api.tcg.online",
  riftbound: "https://api.tcg.online",
  "flesh-and-blood": "https://api.tcg.online",
  "grand-archive": "https://api.tcg.online",
  naruto: "https://api.tcg.online",
  "alpha-clash": "https://api.tcg.online",
};

export function gameApiBaseUrl(gameSlug: GameSlug, env: RuntimeApiEnv = runtimeApiEnv()): string {
  const runtimeUrls = parseRuntimeApiUrlMap(env.VITE_GAME_RUNTIME_API_URLS);
  const configuredOrigin = runtimeUrls[gameSlug]?.trim();
  if (configuredOrigin) {
    return normalizeApiBase(configuredOrigin);
  }
  if (env[SERVER_INTERNAL_RUNTIME_ONLY]) {
    throw new Error(
      `GAME_RUNTIME_API_INTERNAL_URLS is missing an internal runtime API origin for '${gameSlug}'`,
    );
  }
  return normalizeApiBase(env.VITE_API_URL ?? PUBLIC_PRODUCTION_GAME_RUNTIME_API_ORIGINS[gameSlug]);
}

export function playUrl(
  gameSlug: GameSlug,
  suffix: string,
  env: RuntimeApiEnv = runtimeApiEnv(),
): string {
  const tail = suffix.startsWith("/") ? suffix : `/${suffix}`;
  return `${gameApiBaseUrl(gameSlug, env)}/v1/games/${encodeURIComponent(gameSlug)}/play${tail}`;
}

export function gatewayTicketUrl(gameSlug: GameSlug, env: RuntimeApiEnv = runtimeApiEnv()): string {
  return `${gameApiBaseUrl(gameSlug, env)}/v1/gateway/ticket`;
}

export function gatewaySocketUrl(gameSlug: GameSlug, env: RuntimeApiEnv = runtimeApiEnv()): string {
  const explicit = env.VITE_GAME_SERVER_WS_URL ?? env.VITE_GATEWAY_WS_URL;
  return `${normalizeOrigin(explicit || "wss://gateway.tcg.online")}/${gameSlug}`;
}

export function matchHistoryUrl(
  gameSlug: GameSlug,
  suffix: string,
  env: RuntimeApiEnv = runtimeApiEnv(),
): string {
  const tail = suffix.startsWith("/") ? suffix : `/${suffix}`;
  return `${gameApiBaseUrl(gameSlug, env)}/v1/match-history${tail}`;
}

export function apiUrl(
  gameSlug: GameSlug,
  suffix: string,
  env: RuntimeApiEnv = runtimeApiEnv(),
): string {
  const tail = suffix.startsWith("/") ? suffix : `/${suffix}`;
  return `${gameApiBaseUrl(gameSlug, env)}/v1${tail}`;
}

export function normalizeApiBase(value: string | undefined): string {
  const trimmed = value?.trim();
  if (!trimmed) {
    return "";
  }
  return trimmed.replace(/\/v1\/?$/i, "").replace(/\/$/, "");
}

export function parseRuntimeApiUrlMap(value: string | undefined): Record<string, string> {
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

function runtimeApiEnv(): RuntimeApiEnv {
  return import.meta.env as RuntimeApiEnv;
}
