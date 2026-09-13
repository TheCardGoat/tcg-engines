import type { GrandArchivePlayerId } from "../../game/identity.ts";
import type { GrandArchiveMatchState, GrandArchiveOpportunityWindow } from "../../game/model.ts";

/** Whether an Interdiction card activation currently prevents every Opportunity window. */
export function grandArchiveOpportunityIsSuppressed(
  state: GrandArchiveMatchState,
  excludingStackItemId?: import("../../game/identity.ts").GrandArchiveStackItemId,
): boolean {
  return (
    state.status === "pregame" ||
    state.stack.some(
      (item) => item.id !== excludingStackItemId && item.opportunityPolicy !== "normal",
    )
  );
}

export function activeGrandArchivePlayers(
  state: GrandArchiveMatchState,
): readonly GrandArchivePlayerId[] {
  return state.turnOrder.filter((playerId) => !state.players[playerId]?.lost);
}

export function nextGrandArchivePlayer(
  state: GrandArchiveMatchState,
  playerId: GrandArchivePlayerId,
): GrandArchivePlayerId {
  const players = activeGrandArchivePlayers(state);
  const index = players.indexOf(playerId);
  if (index < 0) throw new Error(`${playerId} is not an active player`);
  const next = players[(index + 1) % players.length];
  if (!next) throw new Error("No active player remains");
  return next;
}

export function openGrandArchiveOpportunity(
  state: GrandArchiveMatchState,
  holderId: GrandArchivePlayerId,
  reason: GrandArchiveOpportunityWindow["reason"],
  excludingStackItemId?: import("../../game/identity.ts").GrandArchiveStackItemId,
): GrandArchiveOpportunityWindow {
  if (grandArchiveOpportunityIsSuppressed(state, excludingStackItemId)) {
    throw new Error("Interdiction prevents Opportunity from being granted");
  }
  if (state.players[holderId]?.lost !== false) {
    throw new Error("Opportunity can only be given to an active player");
  }
  return { holderId, startedById: holderId, passedPlayerIds: [], reason };
}

export interface GrandArchivePassOutcome {
  readonly cycleComplete: boolean;
  readonly nextPlayerId?: GrandArchivePlayerId;
}

export function determineGrandArchivePassOutcome(
  state: GrandArchiveMatchState,
  playerId: GrandArchivePlayerId,
): GrandArchivePassOutcome {
  const window = state.opportunity;
  if (!window || window.holderId !== playerId) throw new Error("Player does not have Opportunity");
  const activePlayers = activeGrandArchivePlayers(state);
  const passed = new Set([...window.passedPlayerIds, playerId]);
  if (activePlayers.every((candidate) => passed.has(candidate))) return { cycleComplete: true };
  return { cycleComplete: false, nextPlayerId: nextGrandArchivePlayer(state, playerId) };
}
