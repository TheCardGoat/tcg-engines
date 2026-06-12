import type { CardInstanceId } from "../types/branded.ts";
import type { MoveDefinition, MoveInput } from "../types/commands.ts";
import { processCardSpentEventsSince, processEventTriggers } from "../ability-executor.ts";
import { getEffectiveRules } from "../active-effects/index.ts";
import { defOf, getDefinitionFor } from "../state/lookups.ts";
import { satisfiesMustAttackRequirement } from "./attack-requirements.ts";

export interface AttackRivalInput extends MoveInput {
  args: {
    attackerId: string;
  };
}

export const attackRivalMove: MoveDefinition<AttackRivalInput> = {
  available({ state, playerId }) {
    if (state.G.gamePhase !== "main") return false;
    if (state.G.turnMetadata.activePlayerId !== playerId) return false;
    if (state.G.attackState) return false;

    const player = state.G.players[playerId as string];
    if (!player) return false;

    return player.zones.field.some((id) => {
      const card = state.G.cardIndex[id as string];
      if (!card || card.meta.spent) return false;
      const rules = getEffectiveRules(
        state as import("../types/match-state.ts").MatchState,
        id as string,
      );
      if (rules.includes("cantAttack")) return false;
      if (card.meta.playedThisTurn && !rules.includes("adrenaline")) return false;
      const def = defOf(card);
      return def.type === "unit" || def.keywords.includes("goSolo");
    });
  },

  validate({ state, playerId, input }) {
    const { attackerId } = input.args;
    const player = state.G.players[playerId as string];
    if (!player) return { valid: false, error: "Player not found", errorCode: "PLAYER_NOT_FOUND" };
    if (state.G.gamePhase !== "main")
      return { valid: false, error: "Not in main phase", errorCode: "WRONG_PHASE" };
    if (state.G.attackState)
      return { valid: false, error: "Attack already in progress", errorCode: "ATTACK_IN_PROGRESS" };

    const attacker = state.G.cardIndex[attackerId];
    if (!attacker)
      return { valid: false, error: "Attacker not found", errorCode: "CARD_NOT_FOUND" };
    if (!player.zones.field.includes(attackerId as CardInstanceId)) {
      return { valid: false, error: "Attacker not on your field", errorCode: "NOT_ON_FIELD" };
    }
    if (attacker.meta.spent)
      return { valid: false, error: "Attacker is spent", errorCode: "CARD_SPENT" };
    if (attacker.meta.playedThisTurn) {
      const attackerRules = getEffectiveRules(
        state as import("../types/match-state.ts").MatchState,
        attackerId,
      );
      if (!attackerRules.includes("adrenaline")) {
        return {
          valid: false,
          error: "Can't attack on turn played",
          errorCode: "SUMMONING_SICKNESS",
        };
      }
    }

    const attackerRules = getEffectiveRules(
      state as import("../types/match-state.ts").MatchState,
      attackerId,
    );
    if (attackerRules.includes("cantAttack")) {
      return { valid: false, error: "Attacker can't attack", errorCode: "CANT_ATTACK" };
    }
    if (
      !satisfiesMustAttackRequirement(
        state as import("../types/match-state.ts").MatchState,
        playerId,
        attackerId as CardInstanceId,
      )
    ) {
      return {
        valid: false,
        error: "A different unit must attack if it can",
        errorCode: "MUST_ATTACK",
      };
    }

    return { valid: true };
  },

  execute({ state, playerId, input, operations }) {
    const { attackerId } = input.args;
    const opponentId = state.ctx.playerIds.find((id) => id !== playerId)!;
    const eventsBeforeSpend = operations.event.getEmittedEvents().length;

    operations.card.spend(attackerId as CardInstanceId);
    operations.card.setAttackedThisTurn(attackerId as CardInstanceId, true);

    operations.game.setAttackState({
      attackerId: attackerId as CardInstanceId,
      defenderId: null,
      rivalId: opponentId,
      kind: "direct",
      step: "offensive",
    });

    const attackerName = state.G.cardIndex[attackerId]
      ? getDefinitionFor(state.G, attackerId).displayName
      : "";

    const attackDeclaredEvent = {
      type: "attackDeclared" as const,
      attackerId: attackerId as CardInstanceId,
      defenderId: null,
      attackKind: "direct" as const,
      playerId,
    };

    operations.event.emit(attackDeclaredEvent);

    operations.event.emit({
      type: "actionLog",
      messageKey: "move.attackRival",
      params: { attackerName },
      playerId,
    });

    processCardSpentEventsSince(
      eventsBeforeSpend,
      state as import("../types/match-state.ts").MatchState,
      operations,
    );

    processEventTriggers(
      attackDeclaredEvent,
      state as import("../types/match-state.ts").MatchState,
      operations,
    );
  },
};
