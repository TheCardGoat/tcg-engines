import { isPlayableGameSlug, type PlayableGameSlug } from "./games.js";

interface RealtimeViewerScopeBase {
  /** Optional only for credentials issued before namespace binding was introduced. */
  gameSlug?: PlayableGameSlug;
  matchId: string;
  gameId: string;
  expiresAt: number;
}

/** Match/game/role binding issued by the General API and verified by Gateway. */
export type RealtimeViewerScope = RealtimeViewerScopeBase &
  (
    | {
        role: "player";
        actorId: string;
        userId: string;
      }
    | {
        role: "spectator";
        spectatorId: string;
        userId?: string;
      }
  );

export function parseRealtimeViewerScope(value: unknown): RealtimeViewerScope | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const scope = value as Record<string, unknown>;
  if (
    typeof scope.matchId !== "string" ||
    scope.matchId.length === 0 ||
    typeof scope.gameId !== "string" ||
    scope.gameId.length === 0 ||
    typeof scope.expiresAt !== "number" ||
    !Number.isFinite(scope.expiresAt) ||
    scope.expiresAt < 0 ||
    (scope.gameSlug !== undefined && !isPlayableGameSlug(scope.gameSlug))
  ) {
    return null;
  }
  const common = {
    ...(scope.gameSlug ? { gameSlug: scope.gameSlug } : {}),
    matchId: scope.matchId,
    gameId: scope.gameId,
    expiresAt: scope.expiresAt,
  };
  if (
    scope.role === "player" &&
    typeof scope.actorId === "string" &&
    scope.actorId.length > 0 &&
    typeof scope.userId === "string" &&
    scope.userId.length > 0
  ) {
    return { ...common, role: "player", actorId: scope.actorId, userId: scope.userId };
  }
  if (
    scope.role === "spectator" &&
    typeof scope.spectatorId === "string" &&
    scope.spectatorId.length > 0 &&
    (scope.userId === undefined || (typeof scope.userId === "string" && scope.userId.length > 0))
  ) {
    return {
      ...common,
      role: "spectator",
      spectatorId: scope.spectatorId,
      ...(scope.userId ? { userId: scope.userId } : {}),
    };
  }
  return null;
}
