import type { CardInstanceId } from "../types/branded.ts";
import type { MoveDefinition, MoveInput } from "../types/commands.ts";
import { processCardSpentEventsSince, processEventTriggers } from "../ability-executor.ts";
import { getEffectiveRules, markDefeatAtEndOfTurnIfAttacked } from "../active-effects/index.ts";
import { getDefinitionFor } from "../state/lookups.ts";

export interface UseBlockerInput extends MoveInput {
  args: {
    blockerId: string;
  };
}

export const useBlockerMove: MoveDefinition<UseBlockerInput> = {
  available({ state, playerId }) {
    if (state.G.gamePhase !== "main") return false;
    const attack = state.G.attackState;
    if (!attack) return false;
    if (attack.step !== "defensive") return false;
    if (attack.rivalId !== playerId) return false;

    // Attacker with cantBeBlocked prevents all blocking.
    const attackerRules = getEffectiveRules(state, attack.attackerId as string);
    if (attackerRules.includes("cantBeBlocked")) return false;

    const player = state.G.players[playerId as string];
    if (!player) return false;

    return player.zones.field.some((id) => {
      const card = state.G.cardIndex[id as string];
      return card && !card.meta.spent && getEffectiveRules(state, id as string).includes("blocker");
    });
  },

  validate({ state, playerId, input }) {
    const { blockerId } = input.args;
    const attack = state.G.attackState;
    if (!attack || attack.step !== "defensive") {
      return { valid: false, error: "Not in defensive step", errorCode: "NOT_DEFENSIVE_STEP" };
    }
    if (attack.rivalId !== playerId) {
      return { valid: false, error: "Not your defensive step", errorCode: "NOT_YOUR_DEFENSE" };
    }

    const blocker = state.G.cardIndex[blockerId];
    if (!blocker) return { valid: false, error: "Blocker not found", errorCode: "CARD_NOT_FOUND" };

    const player = state.G.players[playerId as string];
    if (!player?.zones.field.includes(blockerId as CardInstanceId)) {
      return { valid: false, error: "Blocker not on field", errorCode: "NOT_ON_FIELD" };
    }
    if (blocker.meta.spent)
      return { valid: false, error: "Blocker is spent", errorCode: "CARD_SPENT" };

    const hasBlocker = getEffectiveRules(state, blockerId).includes("blocker");
    if (!hasBlocker)
      return { valid: false, error: "Card does not have blocker", errorCode: "NO_BLOCKER" };

    // Attacker with cantBeBlocked cannot be blocked.
    const attackerRules = getEffectiveRules(state, attack.attackerId as string);
    if (attackerRules.includes("cantBeBlocked")) {
      return { valid: false, error: "Attacker can't be blocked", errorCode: "CANT_BE_BLOCKED" };
    }

    return { valid: true };
  },

  execute({ state, playerId, input, operations }) {
    const { blockerId } = input.args;
    const attack = state.G.attackState;
    if (!attack) return;

    const blockerName = state.G.cardIndex[blockerId]
      ? getDefinitionFor(state.G, blockerId).displayName
      : "";
    const attackerName = state.G.cardIndex[attack.attackerId as string]
      ? getDefinitionFor(state.G, attack.attackerId as string).displayName
      : "";

    const eventsBeforeSpend = operations.event.getEmittedEvents().length;
    operations.card.spend(blockerId as CardInstanceId);
    processCardSpentEventsSince(
      eventsBeforeSpend,
      state as import("../types/match-state.ts").MatchState,
      operations,
    );

    const blockerActivatedEvent = {
      type: "blockerActivated",
      blockerId: blockerId as CardInstanceId,
      originalTarget: attack.defenderId,
      playerId,
    } as const;
    operations.event.emit(blockerActivatedEvent);
    processEventTriggers(
      blockerActivatedEvent,
      state as import("../types/match-state.ts").MatchState,
      operations,
    );

    operations.game.setAttackState({
      ...attack,
      defenderId: blockerId as CardInstanceId,
      kind: "fight",
      step: "defensive",
      redirectedByBlocker: true,
    });
    markDefeatAtEndOfTurnIfAttacked(
      state as import("../types/match-state.ts").MatchState,
      attack.attackerId,
    );
    markDefeatAtEndOfTurnIfAttacked(
      state as import("../types/match-state.ts").MatchState,
      blockerId as CardInstanceId,
    );

    operations.event.emit({
      type: "actionLog",
      messageKey: "move.useBlocker",
      params: { blockerName, attackerName, originalAttackKind: attack.kind },
      playerId,
    });
  },
};
