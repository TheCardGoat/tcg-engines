import type { FabRulesSnapshot } from "../kernel/transaction-kernel.ts";
import type { FabCommittedEventBatch } from "./events.ts";
import type { FabDelayedTriggerExpiry, FabDelayedTriggerPolicy } from "./process.ts";

/** CR 6.6.3a: a delayed trigger exists only inside its printed duration. */
export function delayedTriggerIsActive(
  state: FabRulesSnapshot,
  policy: FabDelayedTriggerPolicy,
): boolean {
  const expiry = policy.expiresAt;
  switch (expiry.kind) {
    case "turn":
      return state.turnNumber <= expiry.turnNumber;
    case "phase":
      return state.turnNumber === expiry.turnNumber && state.phase === expiry.phase;
    case "player-turn-start":
      // The start-phase event is collected after its reducer has already
      // advanced state into the target player's start phase. Keep the trigger
      // functional through that boundary; expiredDelayedTriggerIdsAfterBatch
      // removes it immediately after collection.
      return true;
    case "player-turn-end":
      return state.turnNumber <= expiry.turnNumber;
    case "player-action-phase-window":
    case "player-end-phase-window":
      return state.turnNumber <= expiry.windowTurnNumber;
    case "player-next-clash":
      return state.turnNumber <= expiry.turnNumber;
    case "combat-chain": {
      if (expiry.combatNumber < 0) return state.combat?.open === true;
      if (state.combat?.open !== true) return false;
      const current = state.combat.chainLinkNumber ?? 0;
      return state.combat.activeLink !== null
        ? expiry.combatNumber === current
        : expiry.combatNumber === current + 1;
    }
    case "source":
      return delayedTriggerSourceIsInArena(state, expiry);
  }
}

/**
 * Returns unused delayed triggers whose final legal observation boundary just
 * committed. Trigger collection must run before this check.
 */
export function expiredDelayedTriggerIdsAfterBatch(
  state: FabRulesSnapshot,
  batch: FabCommittedEventBatch,
): readonly string[] {
  return state.delayedTriggers.flatMap((delayed) =>
    delayedTriggerExpiresAfterBatch(state, delayed.policy.expiresAt, batch)
      ? [delayed.delayedTriggerId]
      : [],
  );
}

function delayedTriggerExpiresAfterBatch(
  state: FabRulesSnapshot,
  expiry: FabDelayedTriggerExpiry,
  batch: FabCommittedEventBatch,
): boolean {
  const eventNames = new Set(batch.events.map((event) => event.name));
  switch (expiry.kind) {
    case "turn":
      return (
        state.turnNumber > expiry.turnNumber ||
        (state.turnNumber === expiry.turnNumber && eventNames.has("end-phase"))
      );
    case "phase":
      return (
        state.turnNumber !== expiry.turnNumber ||
        state.phase !== expiry.phase ||
        (expiry.phase === "end" && eventNames.has("end-phase"))
      );
    case "player-turn-start":
      return batch.events.some(
        (event) =>
          event.name === "start-phase" &&
          event.data.turnPlayerId === expiry.playerId &&
          state.turnNumber > expiry.afterTurnNumber,
      );
    case "player-turn-end":
      return (
        state.turnNumber > expiry.turnNumber ||
        batch.events.some(
          (event) =>
            event.name === "end-phase" &&
            event.data.turnPlayerId === expiry.playerId &&
            state.turnNumber === expiry.turnNumber,
        )
      );
    case "player-action-phase-window":
      return (
        state.turnNumber > expiry.windowTurnNumber ||
        batch.events.some(
          (event) =>
            event.name === "end-phase" &&
            event.data.turnPlayerId === expiry.playerId &&
            state.turnNumber === expiry.windowTurnNumber,
        )
      );
    case "player-end-phase-window":
      return (
        state.turnNumber > expiry.windowTurnNumber ||
        batch.events.some(
          (event) =>
            event.name === "end-phase" &&
            event.data.turnPlayerId === expiry.playerId &&
            state.turnNumber === expiry.windowTurnNumber,
        )
      );
    case "player-next-clash":
      return (
        state.turnNumber > expiry.turnNumber ||
        (state.turnNumber === expiry.turnNumber && eventNames.has("end-phase")) ||
        batch.events.some(
          (event) =>
            event.name === "clash-outcome" &&
            (event.data.firstPlayerId === expiry.playerId ||
              event.data.secondPlayerId === expiry.playerId),
        )
      );
    case "combat-chain":
      return expiry.combatNumber < 0
        ? eventNames.has("combat-chain-close")
        : batch.events.some(
            (event) =>
              event.name === "chain-link-resolve" &&
              event.context.chainLinkNumber === expiry.combatNumber,
          );
    case "source":
      return !delayedTriggerSourceIsInArena(state, expiry);
  }
}

function delayedTriggerSourceIsInArena(
  state: FabRulesSnapshot,
  expiry: Extract<FabDelayedTriggerExpiry, { readonly kind: "source" }>,
): boolean {
  const record = state.objects[expiry.ref.instanceId];
  if (!record || record.incarnation !== expiry.ref.incarnation) return false;
  return state.playerIds.some((playerId) => {
    const zones = state.containers.zonesByPlayerId[playerId];
    return (
      zones !== undefined &&
      [
        zones.arena,
        zones.heroZone,
        zones.weapon1,
        zones.weapon2,
        zones.head,
        zones.chest,
        zones.arms,
        zones.legs,
      ].some((zone) => zone.includes(expiry.ref.instanceId))
    );
  });
}
