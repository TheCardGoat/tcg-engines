import { isPlayableGameSlug, type PlayableGameSlug } from "./games.js";
import { parseRealtimeViewerScope, type RealtimeViewerScope } from "./viewer-scope.js";

export const WS_TICKET_PAYLOAD_VERSION = 1 as const;

/**
 * Maximum age of a ticket before redeemers must reject it, in milliseconds.
 * Matches the non-production issuer TTL (60s); production issuers write a
 * tighter 30s Redis TTL, so Redis expiry dominates there. This check is
 * defense-in-depth for payloads that outlive (or never had) their Redis TTL.
 */
export const WS_TICKET_MAX_AGE_MS = 60_000;

export interface WsTicketPayload {
  v: typeof WS_TICKET_PAYLOAD_VERSION;
  userId: string | null;
  gameSlug?: PlayableGameSlug;
  viewerScope?: RealtimeViewerScope;
  createdAt?: number;
}

export function createScopedWsTicketPayload(
  gameSlug: PlayableGameSlug,
  viewerScope: RealtimeViewerScope,
  createdAt: number = Date.now(),
): WsTicketPayload {
  if (!Number.isFinite(createdAt) || createdAt < 0) {
    throw new Error("WebSocket ticket createdAt must be a non-negative finite number");
  }
  if (viewerScope.gameSlug && viewerScope.gameSlug !== gameSlug) {
    throw new Error("WebSocket ticket and viewer scope game slugs must match");
  }
  return {
    v: WS_TICKET_PAYLOAD_VERSION,
    userId: viewerScope.userId ?? null,
    gameSlug,
    viewerScope: { ...viewerScope, gameSlug },
    createdAt,
  };
}

export interface CreateWsTicketPayloadOptions {
  gameSlug?: PlayableGameSlug;
  createdAt?: number;
}

export function createWsTicketPayload(
  userId: string,
  options: CreateWsTicketPayloadOptions = {},
): WsTicketPayload {
  if (userId.length === 0) {
    throw new Error("WebSocket ticket userId must not be empty");
  }
  const createdAt = options.createdAt ?? Date.now();
  if (!Number.isFinite(createdAt) || createdAt < 0) {
    throw new Error("WebSocket ticket createdAt must be a non-negative finite number");
  }
  return {
    v: WS_TICKET_PAYLOAD_VERSION,
    userId,
    ...(options.gameSlug ? { gameSlug: options.gameSlug } : {}),
    createdAt,
  };
}

/**
 * Parse a ticket payload from Redis. Unversioned payloads remain accepted
 * during the rolling migration, while unknown explicit versions fail closed.
 */
export function parseWsTicketPayload(raw: string): WsTicketPayload | null {
  let value: unknown;
  try {
    value = JSON.parse(raw);
  } catch {
    return null;
  }
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;

  const record = value as Record<string, unknown>;
  if (record.v !== undefined && record.v !== WS_TICKET_PAYLOAD_VERSION) return null;
  const viewerScope =
    record.viewerScope === undefined ? undefined : parseRealtimeViewerScope(record.viewerScope);
  if (record.viewerScope !== undefined && !viewerScope) return null;
  const userId =
    typeof record.userId === "string" && record.userId.length > 0 ? record.userId : null;
  if (!userId && !viewerScope) return null;
  if (record.gameSlug !== undefined && !isPlayableGameSlug(record.gameSlug)) return null;
  if (viewerScope?.gameSlug && record.gameSlug && viewerScope.gameSlug !== record.gameSlug) {
    return null;
  }
  if (viewerScope?.role === "player" && userId !== viewerScope.userId) return null;
  if (viewerScope?.role === "spectator" && viewerScope.userId && userId !== viewerScope.userId) {
    return null;
  }
  if (record.v === WS_TICKET_PAYLOAD_VERSION && record.createdAt === undefined) return null;
  if (
    record.createdAt !== undefined &&
    (typeof record.createdAt !== "number" ||
      !Number.isFinite(record.createdAt) ||
      record.createdAt < 0)
  ) {
    return null;
  }

  return {
    v: WS_TICKET_PAYLOAD_VERSION,
    userId,
    ...(record.gameSlug ? { gameSlug: record.gameSlug } : {}),
    ...(viewerScope ? { viewerScope } : {}),
    ...(typeof record.createdAt === "number" ? { createdAt: record.createdAt } : {}),
  };
}

/**
 * Freshness check shared by the ticket issuer and every redeemer. Payloads
 * without `createdAt` (legacy unversioned tickets) have nothing to check and
 * stay acceptable; v1 payloads older than `maxAgeMs` are stale and must be
 * rejected even if a Redis copy somehow outlived its TTL.
 */
export function isWsTicketFresh(
  payload: WsTicketPayload,
  now: number = Date.now(),
  maxAgeMs: number = WS_TICKET_MAX_AGE_MS,
): boolean {
  if (payload.createdAt === undefined) return true;
  const age = now - payload.createdAt;
  return age >= 0 && age <= maxAgeMs;
}
