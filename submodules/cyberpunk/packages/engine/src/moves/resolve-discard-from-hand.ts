import type { CardInstanceId } from "../types/branded.ts";
import type { MoveDefinition, MoveInput } from "../types/commands.ts";
import type { ChooseTargetPendingChoice } from "../types/match-state.ts";
import { executeAbilityEffects, resumeCurrentTrigger } from "../ability-executor.ts";
import type { ResolutionContext } from "../effects/target-resolver.ts";

export interface ResolveDiscardFromHandInput extends MoveInput {
  args: {
    cardIds?: string[];
    pass?: boolean;
  };
}

export const resolveDiscardFromHandMove: MoveDefinition<ResolveDiscardFromHandInput> = {
  handlesPendingChoice: true,

  available({ state, playerId }) {
    const choice = state.G.turnMetadata.pendingChoice;
    if (!choice || choice.type !== "chooseTarget") return false;
    const typed = choice as ChooseTargetPendingChoice;
    if (typed.payload.type !== "discardFromHand") return false;
    return (choice.chooserId as string) === (playerId as string);
  },

  validate({ state, playerId, input }) {
    const choice = state.G.turnMetadata.pendingChoice;
    if (!choice || choice.type !== "chooseTarget") {
      return { valid: false, error: "No chooseTarget pending", errorCode: "NO_PENDING_CHOICE" };
    }
    const typed = choice as ChooseTargetPendingChoice;
    if (typed.payload.type !== "discardFromHand") {
      return {
        valid: false,
        error: "Pending choice is not discardFromHand",
        errorCode: "WRONG_PENDING_CHOICE",
      };
    }
    if ((choice.chooserId as string) !== (playerId as string)) {
      return { valid: false, error: "Not your choice to resolve", errorCode: "NOT_YOUR_CHOICE" };
    }
    if (input.args.pass) {
      return typed.payload.canDecline
        ? { valid: true }
        : { valid: false, error: "Cannot pass this discard choice", errorCode: "CANNOT_PASS" };
    }
    const cardIds = input.args.cardIds ?? [];
    if (new Set(cardIds).size !== cardIds.length) {
      return {
        valid: false,
        error: "Duplicate card IDs are not allowed",
        errorCode: "DUPLICATE_CARD_IDS",
      };
    }
    const requiredAmount = typed.payload.amount ?? 1;
    if (cardIds.length !== requiredAmount) {
      return {
        valid: false,
        error: `Must select exactly ${requiredAmount} card(s)`,
        errorCode: "INVALID_AMOUNT",
      };
    }
    const eligible = typed.payload.eligibleIds;
    // Verify all selected cards are in the player's hand.
    const player = state.G.players[playerId as string];
    if (!player) {
      return { valid: false, error: "Player not found", errorCode: "INVALID_PLAYER" };
    }
    for (const id of cardIds) {
      if (eligible && !eligible.includes(id)) {
        return {
          valid: false,
          error: `Card ${id} is not eligible for this discard`,
          errorCode: "INVALID_CHOICE",
        };
      }
      if (!player.zones.hand.includes(id as CardInstanceId)) {
        return {
          valid: false,
          error: `Card ${id} is not in your hand`,
          errorCode: "CARD_NOT_IN_HAND",
        };
      }
    }
    return { valid: true };
  },

  execute({ state, playerId, input, operations }) {
    const choice = state.G.turnMetadata.pendingChoice as ChooseTargetPendingChoice;
    const payload = choice.payload;
    operations.game.setPendingChoice(undefined);
    if (input.args.pass) {
      operations.log.emit({
        type: "resolveDiscardFromHand",
        playerId,
        timestamp: Date.now(),
        turnNumber: state.G.turnMetadata.turnNumber,
        discardedCount: 0,
        passed: true,
      });
      if (payload.elseEffects?.length && payload.sourceCardId && payload.sourcePlayerId) {
        const ctx: ResolutionContext = {
          state,
          sourceCardId: payload.sourceCardId,
          sourcePlayerId: payload.sourcePlayerId,
          abilityIndex: payload.abilityIndex ?? 0,
          contextTargets: payload.contextTargets ?? {},
          boundTargets: payload.boundTargets ?? {},
        };
        const status = executeAbilityEffects(payload.elseEffects, ctx, operations);
        if (status === "suspended") return;
      }
      resumeCurrentTrigger(state, operations);
      return;
    }

    const cardIds = input.args.cardIds ?? [];
    for (const id of cardIds) {
      operations.zone.moveCard(id as CardInstanceId, "trash", playerId);
    }
    const current = state.G.turnMetadata.currentTrigger;
    if (current) {
      current.contextTargets = {
        ...current.contextTargets,
        discardedCards: cardIds,
      };
    }
    operations.log.emit({
      type: "resolveDiscardFromHand",
      playerId,
      timestamp: Date.now(),
      turnNumber: state.G.turnMetadata.turnNumber,
      discardedCount: cardIds.length,
    });
    if (payload.ifEffects?.length && payload.sourceCardId && payload.sourcePlayerId) {
      const ctx: ResolutionContext = {
        state,
        sourceCardId: payload.sourceCardId,
        sourcePlayerId: payload.sourcePlayerId,
        abilityIndex: payload.abilityIndex ?? 0,
        contextTargets: payload.contextTargets ?? {},
        boundTargets: payload.boundTargets ?? {},
      };
      const status = executeAbilityEffects(payload.ifEffects, ctx, operations);
      if (status === "suspended") return;
    }
    resumeCurrentTrigger(state, operations);
  },
};
