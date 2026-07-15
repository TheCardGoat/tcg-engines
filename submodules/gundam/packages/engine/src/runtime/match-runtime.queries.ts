/**
 * Query helpers for the match runtime.
 * Enumerates available moves for a given player.
 */

import type { PlayerId } from "../types/branded.ts";
import type { MatchState } from "../types/match-state.ts";
import type {
  MoveEnumerationContext,
  FrameworkReadAPI,
  FrameworkStateSnapshot,
  DeepReadonly,
  ZoneQueryAPI,
  TimeQueryAPI,
} from "../types/move-types.ts";

import type { MatchStaticResources } from "./static-resources.ts";
import { getValidMovesForPhase } from "./match-runtime.flow.ts";
import { createCardReadAPI } from "./card-runtime.ts";
import { createZoneOperations } from "./zone-operations.ts";
import { checkTimeout } from "./time-control.ts";

import { gundamMoves } from "../gundam/moves/index.ts";
import type { GundamMoveName } from "../gundam/moves/move-name.ts";
import type { GundamG } from "../gundam/types.ts";
import { gundamFlow } from "../gundam/flow.ts";
import { gundamZones } from "../gundam/zones.ts";
import { deriveGundamRuntimeCard } from "../gundam/config.ts";

/**
 * Build a read-only FrameworkReadAPI from a MatchState (no draft, read-only).
 * Exported for projection helpers that need to evaluate DSL-backed derived
 * state (e.g. `buildPendingChoicePrompt` resolving legal targets) without
 * entering a dispatch cycle.
 */
export function buildReadAPI(
  state: MatchState,
  staticResources: MatchStaticResources,
): FrameworkReadAPI {
  const clockNow = Date.now();
  const noopRandom = () => 0;

  const zoneOps = createZoneOperations(
    // We cast to mutable here but only use read methods.
    // The zone ops API has both read and write; we only expose reads.
    state.ctx.zones as any,
    gundamZones,
    noopRandom,
    state.ctx._stateID,
  );

  const cardReadAPI = createCardReadAPI(
    state.ctx.zones,
    staticResources.cardsMaps,
    gundamZones,
    deriveGundamRuntimeCard as any,
  );

  const stateSnapshot: FrameworkStateSnapshot = {
    status: state.ctx.status as DeepReadonly<typeof state.ctx.status>,
    stateID: state.ctx._stateID,
    playerIds: state.ctx.playerIds as readonly PlayerId[],
  };

  const timeQuery: TimeQueryAPI = {
    getPlayerTime: (pid: PlayerId) => {
      const ps = state.ctx.time.mode === "none" ? undefined : state.ctx.time.players[pid as string];
      return {
        reserveMsRemaining: ps?.reserveMsRemaining ?? 0,
        totalConsumedMs: ps?.totalConsumedMs ?? 0,
      };
    },
    getMode: () => state.ctx.time.mode,
    getActivePlayerId: () =>
      state.ctx.time.mode === "none" ? undefined : state.ctx.time.activePlayerID,
    getTimeoutStatus: (pid: PlayerId, now = clockNow) => checkTimeout(state, pid as string, now),
    isInNegativeTime: (pid: PlayerId) => {
      if (state.ctx.time.mode !== "chess" && state.ctx.time.mode !== "dynamic") return false;
      return state.ctx.time.players[pid as string]?.isInNegativeTime ?? false;
    },
  };

  return {
    state: stateSnapshot,
    zones: zoneOps as ZoneQueryAPI,
    time: timeQuery,
    cards: cardReadAPI,
  };
}

/**
 * UI-facing shape for an available move.
 *
 * `selectableCardIds` is populated for moves that require card selection
 * (`requiresCardSelection === true`) — UI uses it to highlight playable
 * cards. When `enumerateCandidates` returns an empty list the move is
 * dropped from the result entirely, so an empty `selectableCardIds` only
 * appears for moves with `requiresCardSelection === false` (e.g. `passTurn`,
 * `concede`).
 */
export interface AvailableMove {
  readonly moveName: GundamMoveName;
  readonly selectableCardIds: readonly string[];
  readonly requiresCardSelection: boolean;
}

/**
 * Detailed variant of `enumerateAvailableMoves` that also returns, for each
 * available move, the instance IDs the move can be started with. Used by UI
 * clients to drive card highlighting and legal-action display.
 */
export function enumerateAvailableMovesDetailed(
  state: MatchState,
  playerId: PlayerId,
  staticResources: MatchStaticResources,
): AvailableMove[] {
  if (state.ctx.status.gameEnded) return [];

  const flowValidMoves = getValidMovesForPhase(
    gundamFlow,
    state.ctx.status.gameSegment,
    state.ctx.status.phase,
    state.ctx.status.step,
  );

  const frameworkRead = buildReadAPI(state, staticResources);
  const cardReadAPI = frameworkRead.cards;

  // Read once: `gatedByPendingEffects` moves are dropped from enumeration
  // while the queue is non-empty. The Gundam-specific shape is bridged via
  // a structural cast so the framework layer stays generic.
  const hasPendingEffects =
    ((state.G as { pendingEffects?: readonly unknown[] }).pendingEffects?.length ?? 0) > 0;

  const out: AvailableMove[] = [];

  for (const [moveName, moveDef] of Object.entries(gundamMoves)) {
    if (flowValidMoves !== null && !flowValidMoves.includes(moveName)) continue;
    if (!moveDef.ignoreActivePlayer && state.ctx.status.activePlayer !== playerId) continue;
    if (moveDef.gatedByPendingEffects && hasPendingEffects) continue;

    const ctx: MoveEnumerationContext<GundamG> = {
      G: state.G as DeepReadonly<GundamG>,
      playerId,
      cards: cardReadAPI,
      framework: frameworkRead,
    };

    if (moveDef.available) {
      try {
        if (!moveDef.available(ctx)) continue;
      } catch {
        continue;
      }
    }

    let selectableCardIds: readonly string[] = [];
    const requiresCardSelection = typeof moveDef.enumerateCandidates === "function";
    if (moveDef.enumerateCandidates) {
      try {
        selectableCardIds = moveDef.enumerateCandidates(ctx);
      } catch {
        selectableCardIds = [];
      }
      // If the move requires a card selection but has no legal candidates,
      // the move is effectively unavailable — skip it.
      if (selectableCardIds.length === 0) continue;
    }

    out.push({
      moveName: moveName as GundamMoveName,
      selectableCardIds,
      requiresCardSelection,
    });
  }

  return out;
}

/**
 * Enumerate all moves whose `available()` returns true for the given player.
 *
 * For each move in gundamMoves:
 * 1. Check if the move is valid in the current flow position
 * 2. Check active player (unless move.ignoreActivePlayer)
 * 3. Build a MoveEnumerationContext and call available()
 *
 * Returns the names of all available moves.
 */
export function enumerateAvailableMoves(
  state: MatchState,
  playerId: PlayerId,
  staticResources: MatchStaticResources,
): string[] {
  // If game has ended, no moves are available
  if (state.ctx.status.gameEnded) {
    return [];
  }

  // Get flow-restricted valid moves (null means all moves are allowed)
  const flowValidMoves = getValidMovesForPhase(
    gundamFlow,
    state.ctx.status.gameSegment,
    state.ctx.status.phase,
    state.ctx.status.step,
  );

  const frameworkRead = buildReadAPI(state, staticResources);
  const cardReadAPI = frameworkRead.cards;

  // Drop `gatedByPendingEffects` moves while the queue is non-empty (rule 5-2).
  const hasPendingEffects =
    ((state.G as { pendingEffects?: readonly unknown[] }).pendingEffects?.length ?? 0) > 0;

  const available: string[] = [];

  for (const [moveName, moveDef] of Object.entries(gundamMoves)) {
    // Skip if flow restricts and this move is not in the valid set
    if (flowValidMoves !== null && !flowValidMoves.includes(moveName)) {
      continue;
    }

    // Active player check: if the move doesn't ignore the active player gate,
    // only the active player can execute it
    if (!moveDef.ignoreActivePlayer) {
      if (state.ctx.status.activePlayer !== playerId) {
        continue;
      }
    }

    if (moveDef.gatedByPendingEffects && hasPendingEffects) {
      continue;
    }

    // If the move defines an available() check, call it
    if (moveDef.available) {
      const ctx: MoveEnumerationContext<GundamG> = {
        G: state.G as DeepReadonly<GundamG>,
        playerId,
        cards: cardReadAPI,
        framework: frameworkRead,
      };

      try {
        if (!moveDef.available(ctx)) {
          continue;
        }
      } catch {
        // If available() throws, treat the move as unavailable
        continue;
      }
    }

    available.push(moveName);
  }

  return available;
}
