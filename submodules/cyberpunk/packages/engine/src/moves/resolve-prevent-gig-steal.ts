import type { CardInstanceId } from "../types/branded.ts";
import type { MoveDefinition, MoveInput } from "../types/commands.ts";
import type { PreventGigStealPendingChoice } from "../types/match-state.ts";
import { performGigSteal } from "./resolve-attack.ts";
import { enqueueEventTriggers, resumeCurrentTrigger } from "../ability-executor.ts";
import { resumeSuspendedEndTurn } from "./pass-phase.ts";

export interface ResolvePreventGigStealInput extends MoveInput {
  args: {
    /** Omit/leave empty (or set pass) to decline prevention and let all steals resolve. */
    pass?: boolean;
    /** One (die, card) pair per Gig to prevent; the card is discarded. */
    preventions: Array<{ dieId: string; cardId: string }>;
  };
}

/**
 * Resolves a `preventGigSteal` pending choice offered to the defender. Each
 * prevented Gig must be paired with a distinct hand card whose cost equals that
 * Gig's face value; those cards are discarded and only the remaining dice are
 * stolen via {@link performGigSteal}.
 */
export const resolvePreventGigStealMove: MoveDefinition<ResolvePreventGigStealInput> = {
  handlesPendingChoice: true,

  available({ state, playerId }) {
    const choice = state.G.turnMetadata.pendingChoice;
    if (!choice || choice.type !== "preventGigSteal") return false;
    return (choice.chooserId as string) === (playerId as string);
  },

  validate({ state, playerId, input }) {
    const choice = state.G.turnMetadata.pendingChoice;
    if (!choice || choice.type !== "preventGigSteal") {
      return {
        valid: false,
        error: "No preventGigSteal pending",
        errorCode: "NO_PENDING_CHOICE",
      };
    }
    if ((choice.chooserId as string) !== (playerId as string)) {
      return { valid: false, error: "Not your choice to resolve", errorCode: "NOT_YOUR_CHOICE" };
    }
    if (!choice.payload.effectSteal && !state.G.attackState) {
      return { valid: false, error: "No attack in progress", errorCode: "NO_ATTACK" };
    }
    if (input.args.pass) return { valid: true };

    const typed = choice as PreventGigStealPendingChoice;
    const stealValueByDie = new Map(
      typed.payload.stealEntries.map((entry) => [entry.dieId as string, entry.value]),
    );
    const handCostByCard = new Map(
      typed.payload.handEntries.map((entry) => [entry.cardId as string, entry.cost]),
    );
    const usedCards = new Set<string>();
    const usedDice = new Set<string>();

    for (const prevention of input.args.preventions ?? []) {
      if (!stealValueByDie.has(prevention.dieId)) {
        return {
          valid: false,
          error: `Die ${prevention.dieId} is not being stolen`,
          errorCode: "INVALID_DIE",
        };
      }
      if (!handCostByCard.has(prevention.cardId)) {
        return {
          valid: false,
          error: `Card ${prevention.cardId} is not an eligible discard`,
          errorCode: "INVALID_CARD",
        };
      }
      if (stealValueByDie.get(prevention.dieId) !== handCostByCard.get(prevention.cardId)) {
        return {
          valid: false,
          error: "Discarded card cost must equal the Gig's value",
          errorCode: "COST_MISMATCH",
        };
      }
      if (usedCards.has(prevention.cardId)) {
        return {
          valid: false,
          error: "A hand card can only be discarded once",
          errorCode: "DUPLICATE_CARD",
        };
      }
      if (usedDice.has(prevention.dieId)) {
        return {
          valid: false,
          error: "A Gig can only be prevented once",
          errorCode: "DUPLICATE_DIE",
        };
      }
      usedCards.add(prevention.cardId);
      usedDice.add(prevention.dieId);
    }

    return { valid: true };
  },

  execute({ state, playerId: _playerId, input, operations }) {
    const choice = state.G.turnMetadata.pendingChoice as PreventGigStealPendingChoice | undefined;
    const attack = state.G.attackState;
    if (!choice || (!attack && !choice.payload.effectSteal)) return;

    operations.game.setPendingChoice(undefined);

    const preventedDieIds = new Set<string>();
    if (!input.args.pass) {
      for (const prevention of input.args.preventions ?? []) {
        operations.zone.moveCard(prevention.cardId as CardInstanceId, "trash", choice.chooserId);
        preventedDieIds.add(prevention.dieId);
      }
    }

    const attackerControllerId =
      choice.payload.effectSteal?.sourcePlayerId ??
      state.G.cardIndex[choice.payload.attackerId as string]?.controllerId;
    if (!attackerControllerId) {
      if (!choice.payload.effectSteal) operations.game.setAttackState(null);
      return;
    }

    const remainingGigIds = choice.payload.stealEntries
      .filter((entry) => !preventedDieIds.has(entry.dieId as string))
      .map((entry) => entry.dieId);

    if (choice.payload.effectSteal) {
      for (const gigId of remainingGigIds) {
        operations.gig.moveGig(gigId, attackerControllerId, choice.payload.attackerId);
        const die = state.G.gigDice[gigId as string];
        if (die) {
          enqueueEventTriggers(
            {
              type: "gigStolen",
              dieId: gigId,
              fromPlayerId: choice.chooserId,
              toPlayerId: attackerControllerId,
              sourceCardId: choice.payload.attackerId,
            },
            state,
            operations,
          );
        }
      }
      resumeCurrentTrigger(state, operations);
      resumeSuspendedEndTurn(state, operations);
      return;
    }

    performGigSteal({
      state,
      operations,
      attack: attack!,
      gigIds: remainingGigIds,
      playerId: attackerControllerId,
      attackerName: choice.payload.attackerName,
      attackerPower: choice.payload.attackerPower,
    });
    operations.game.setAttackState(null);
  },
};
