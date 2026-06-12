import type { ServerGameEngine } from "@tcg/shared/game-engine";
import type { EngineInteractionView } from "@tcg/protocol";

/**
 * Compact, player-scoped One Piece state view fed to the LLM. We read from
 * `engine.getState()` (One Piece's `MatchState`) and surface only the fields
 * a competent agent needs: turn / phase, both players' life and zone counts,
 * and the current interaction view.
 */
export interface OnePieceAgentStateView {
  stateId: number;
  turn: number;
  phase?: string;
  activePlayerId?: string;
  isActorTurn: boolean;
  gameEnded: boolean;
  pendingChoice?: { kind: string };
  interactionView?: EngineInteractionView;
  actor: OnePieceAgentPlayerView;
  opponent: OnePieceAgentPlayerView;
}

export interface OnePieceAgentPlayerView {
  id: string;
  lifeCount: number;
  handCount: number;
  deckCount: number;
  donDeckCount: number;
  activeDon: number;
  restedDon: number;
  characterCount: number;
  stageCount: number;
  trashCount: number;
}

interface OnePieceLikeMatchState {
  idCounter?: number;
  status?: string;
  activeSeat?: string;
  turnNumber?: number;
  phase?: string;
  winner?: string;
  players?: Record<string, Record<string, unknown>>;
  promptQueue?: Array<{ kind?: string }>;
}

export function serializeOnePieceState(input: {
  engine: ServerGameEngine;
  actorId: string;
}): OnePieceAgentStateView {
  const state = (input.engine.getState() ?? {}) as OnePieceLikeMatchState;
  const playersData = (state.players ?? {}) as Record<string, Record<string, unknown>>;
  const actorSeat = findSeatForActorId(state, input.actorId);
  const opponentSeat = pickOpponentSeat(playersData, actorSeat);
  const interactionView = readInteractionView(input.engine, input.actorId);

  return {
    stateId: state.idCounter ?? 0,
    turn: state.turnNumber ?? 0,
    phase: state.phase,
    activePlayerId: state.activeSeat,
    isActorTurn: state.activeSeat === actorSeat,
    gameEnded: state.status === "finished",
    pendingChoice:
      state.promptQueue && state.promptQueue.length > 0
        ? { kind: state.promptQueue[0]?.kind ?? "unknown" }
        : undefined,
    ...(interactionView ? { interactionView } : {}),
    actor: serializePlayer({
      id: input.actorId,
      data: actorSeat ? (playersData[actorSeat] ?? {}) : {},
    }),
    opponent: serializePlayer({
      id: opponentSeat
        ? ((playersData[opponentSeat]?.playerName as string) ?? opponentSeat)
        : "unknown",
      data: opponentSeat ? (playersData[opponentSeat] ?? {}) : {},
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

function findSeatForActorId(state: OnePieceLikeMatchState, actorId: string): string | undefined {
  if (!state.players) return undefined;
  for (const [seat, data] of Object.entries(state.players)) {
    if (data.playerName === actorId) return seat;
  }
  return undefined;
}

function pickOpponentSeat(
  players: Record<string, Record<string, unknown>>,
  actorSeat: string | undefined,
): string | undefined {
  for (const seat of Object.keys(players)) {
    if (seat !== actorSeat) return seat;
  }
  return undefined;
}

function serializePlayer(input: {
  id: string;
  data: Record<string, unknown>;
}): OnePieceAgentPlayerView {
  const data = input.data;
  return {
    id: input.id,
    lifeCount: zoneCount(data, "life"),
    handCount: zoneCount(data, "hand"),
    deckCount: zoneCount(data, "deck"),
    donDeckCount: asNumber(data.donDeckCount) ?? 0,
    activeDon: asNumber(data.activeDon) ?? 0,
    restedDon: asNumber(data.restedDon) ?? 0,
    characterCount: zoneCount(data, "characterArea"),
    stageCount: data.stageArea ? 1 : 0,
    trashCount: zoneCount(data, "trash"),
  };
}

function asNumber(value: unknown): number | undefined {
  return typeof value === "number" ? value : undefined;
}

function zoneCount(data: Record<string, unknown>, zoneKey: string): number {
  const zone = data[zoneKey];
  if (Array.isArray(zone)) return zone.length;
  if (zone && typeof zone === "object") {
    const items =
      (zone as { items?: unknown[]; cards?: unknown[] }).items ??
      (zone as { items?: unknown[]; cards?: unknown[] }).cards;
    if (Array.isArray(items)) return items.length;
  }
  return 0;
}
