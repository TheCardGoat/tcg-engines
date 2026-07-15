import type { ServerGameEngine } from "@tcg/shared/game-engine";
import type { EngineInteractionView } from "@tcg/protocol";

/**
 * Compact, player-scoped Gundam state view fed to the LLM. We read from
 * `engine.getState()` (Gundam's `MatchState`) and surface only the fields
 * a competent agent needs: turn / phase / step, available moves for this
 * priority, both players' shields and zone counts, and lightweight card
 * summaries for the actor's hand + battle area.
 */
export interface GundamAgentStateView {
  stateId: number;
  turn: number;
  phase?: string;
  step?: string;
  activePlayerId?: string;
  isActorTurn: boolean;
  /** Whether a pending choice is waiting on the actor (informational). */
  pendingChoice?: { kind: string };
  interactionView?: EngineInteractionView;
  actor: GundamAgentPlayerView;
  opponent: GundamAgentPlayerView;
}

export interface GundamAgentPlayerView {
  id: string;
  shieldBaseRemaining?: number;
  shieldSectionRemaining?: number;
  handCount: number;
  deckCount: number;
  resourceDeckCount: number;
  resourceAreaCount: number;
  resourceAreaActiveCount: number;
  battleAreaCount: number;
  baseAreaCount: number;
  trashCount: number;
}

interface GundamLikeStatus {
  turn?: number;
  phase?: string;
  step?: string;
  activePlayer?: string;
  gameEnded?: boolean;
  winner?: string;
  winReason?: string;
}

interface GundamLikeCtx {
  status?: GundamLikeStatus;
  _stateID?: number;
}

interface GundamLikeMatchState {
  ctx?: GundamLikeCtx;
  G?: {
    pendingChoice?: { kind?: string };
    players?: Record<string, Record<string, unknown>>;
  };
}

export function serializeGundamState(input: {
  engine: ServerGameEngine;
  actorId: string;
}): GundamAgentStateView {
  const state = (input.engine.getState() ?? {}) as GundamLikeMatchState;
  const ctx = state.ctx ?? {};
  const status = ctx.status ?? {};
  const g = state.G ?? {};
  const playersData = (g.players ?? {}) as Record<string, Record<string, unknown>>;

  const opponentId = pickOpponentId(playersData, input.actorId);
  const interactionView = readInteractionView(input.engine, input.actorId);

  return {
    stateId: ctx._stateID ?? 0,
    turn: status.turn ?? 0,
    phase: status.phase,
    step: status.step,
    activePlayerId: status.activePlayer,
    isActorTurn: status.activePlayer === input.actorId,
    pendingChoice: g.pendingChoice?.kind ? { kind: g.pendingChoice.kind } : undefined,
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
}): GundamAgentPlayerView {
  const data = input.data;
  return {
    id: input.id,
    shieldBaseRemaining: asNumber(data.shieldBaseRemaining ?? data.shieldBase),
    shieldSectionRemaining: asNumber(data.shieldSectionRemaining ?? data.shieldSection),
    handCount: zoneCount(data, "hand"),
    deckCount: zoneCount(data, "deck"),
    resourceDeckCount: zoneCount(data, "resourceDeck"),
    resourceAreaCount: zoneCount(data, "resourceArea"),
    resourceAreaActiveCount: countActive(data, "resourceArea"),
    battleAreaCount: zoneCount(data, "battleArea"),
    baseAreaCount: zoneCount(data, "baseArea"),
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

function countActive(data: Record<string, unknown>, zoneKey: string): number {
  const zone = data[zoneKey];
  const items: unknown[] = Array.isArray(zone)
    ? zone
    : Array.isArray((zone as { items?: unknown[] } | undefined)?.items)
      ? (zone as { items: unknown[] }).items
      : [];
  return items.filter(
    (item) =>
      typeof item === "object" && item !== null && (item as { active?: boolean }).active === true,
  ).length;
}
