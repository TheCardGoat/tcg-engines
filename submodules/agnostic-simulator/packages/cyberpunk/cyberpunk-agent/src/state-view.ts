import type { ServerGameEngine } from "@tcg/shared/game-engine";
import type { EngineInteractionView } from "@tcg/protocol";

/**
 * Compact, player-scoped Cyberpunk state view fed to the LLM. We read
 * generically off `engine.getState()` (Cyberpunk's `MatchState`) and don't
 * import the engine types — the cyberpunk-engine index re-exports test
 * fixtures that transitively import `@tcg/cyberpunk-cards`, whose
 * `exports` map points to a non-existent `dist/`. Loading those at test
 * time breaks bun-test resolution, so we keep this package
 * engine-import-free.
 */
export interface CyberpunkAgentStateView {
  stateId: number;
  turn: number;
  phase?: string;
  activePlayerId?: string;
  isActorTurn: boolean;
  gameEnded: boolean;
  pendingChoice?: { kind: string };
  interactionView?: EngineInteractionView;
  actor: CyberpunkAgentPlayerView;
  opponent: CyberpunkAgentPlayerView;
}

export interface CyberpunkAgentPlayerView {
  id: string;
  life?: number;
  gigs?: number;
  handCount: number;
  deckCount: number;
  discardCount: number;
  unitsInPlay: number;
}

interface CyberpunkLikeStateG {
  gameEnded?: boolean;
  turnMetadata?: {
    activePlayerId?: string;
    turnNumber?: number;
    phase?: string;
    pendingChoice?: { kind?: string } | null;
  };
  players?: Record<string, Record<string, unknown>>;
}

interface CyberpunkLikeState {
  ctx?: { stateID?: number };
  G?: CyberpunkLikeStateG;
}

export function serializeCyberpunkState(input: {
  engine: ServerGameEngine;
  actorId: string;
}): CyberpunkAgentStateView {
  const state = (input.engine.getState() ?? {}) as CyberpunkLikeState;
  const ctx = state.ctx ?? {};
  const g = state.G ?? {};
  const turnMeta = g.turnMetadata ?? {};
  const playersData = g.players ?? {};
  const opponentId = pickOpponentId(playersData, input.actorId);
  const interactionView = readInteractionView(input.engine, input.actorId);

  return {
    stateId: ctx.stateID ?? 0,
    turn: turnMeta.turnNumber ?? 0,
    phase: turnMeta.phase,
    activePlayerId: turnMeta.activePlayerId,
    isActorTurn: turnMeta.activePlayerId === input.actorId,
    gameEnded: g.gameEnded ?? false,
    pendingChoice: turnMeta.pendingChoice?.kind ? { kind: turnMeta.pendingChoice.kind } : undefined,
    ...(interactionView ? { interactionView } : {}),
    actor: serializePlayer({ id: input.actorId, data: playersData[input.actorId] ?? {} }),
    opponent: serializePlayer({
      id: opponentId ?? "unknown",
      data: opponentId ? (playersData[opponentId] ?? {}) : {},
    }),
  };
}

function readInteractionView(
  engine: ServerGameEngine,
  actorId: string,
): EngineInteractionView | undefined {
  try {
    return engine.getInteractionView?.(actorId);
  } catch {
    return undefined;
  }
}

function pickOpponentId(
  players: Record<string, Record<string, unknown>>,
  actorId: string,
): string | undefined {
  for (const id of Object.keys(players)) {
    if (id !== actorId) return id;
  }
  return undefined;
}

function serializePlayer(input: {
  id: string;
  data: Record<string, unknown>;
}): CyberpunkAgentPlayerView {
  const data = input.data;
  return {
    id: input.id,
    life: asNumber(data.life ?? data.health ?? data.objective),
    gigs: asNumber(data.gigs ?? data.resources),
    handCount: zoneCount(data, "hand"),
    deckCount: zoneCount(data, "deck"),
    discardCount: zoneCount(data, "discard"),
    unitsInPlay: zoneCount(data, "play"),
  };
}

function asNumber(value: unknown): number | undefined {
  return typeof value === "number" ? value : undefined;
}

function zoneCount(data: Record<string, unknown>, key: string): number {
  const zone = data[key];
  if (Array.isArray(zone)) return zone.length;
  if (zone && typeof zone === "object") {
    const items =
      (zone as { items?: unknown[]; cards?: unknown[] }).items ??
      (zone as { items?: unknown[]; cards?: unknown[] }).cards;
    if (Array.isArray(items)) return items.length;
  }
  return 0;
}
