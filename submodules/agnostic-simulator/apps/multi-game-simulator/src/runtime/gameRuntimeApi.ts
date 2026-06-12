import type { GameSlug } from "@tcg/simulator-contract";
import { normalizeOrigin } from "@tcg/simulator-runtime/gateway";

export type RuntimeApiEnv = Record<string, string | undefined>;

const PRODUCTION_GAME_RUNTIME_API_ORIGINS: Record<GameSlug, string> = {
  cyberpunk: "https://cyberpunk-api.tcg.online",
  gundam: "https://gundam-api.tcg.online",
  lorcana: "https://lorcana-api.tcg.online",
  "one-piece": "https://one-piece-api.tcg.online",
};

export function gameApiBaseUrl(gameSlug: GameSlug, env: RuntimeApiEnv = runtimeApiEnv()): string {
  const runtimeUrls = parseRuntimeApiUrlMap(env.VITE_GAME_RUNTIME_API_URLS);
  return normalizeApiBase(
    runtimeUrls[gameSlug] ?? PRODUCTION_GAME_RUNTIME_API_ORIGINS[gameSlug] ?? env.VITE_API_URL,
  );
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
