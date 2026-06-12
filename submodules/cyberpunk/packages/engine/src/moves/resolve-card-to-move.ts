import type { CardInstanceId } from "../types/branded.ts";
import type { MoveDefinition, MoveInput } from "../types/commands.ts";
import type { ChooseCardToMovePendingChoice } from "../types/match-state.ts";
import { executeAbilityEffects, resumeCurrentTrigger } from "../ability-executor.ts";
import type { ResolutionContext } from "../effects/target-resolver.ts";
import { tryDefOf } from "../state/lookups.ts";
import { createDefaultMetaForZone } from "../types/card-instance.ts";

export interface ResolveCardToMoveInput extends MoveInput {
  args: {
    cardId?: string;
    pass?: boolean;
  };
}

export const resolveCardToMoveMove: MoveDefinition<ResolveCardToMoveInput> = {
  handlesPendingChoice: true,

  available({ state, playerId }) {
    const choice = state.G.turnMetadata.pendingChoice;
    if (!choice || choice.type !== "chooseCardToMove") return false;
    return (choice.chooserId as string) === (playerId as string);
  },

  validate({ state, playerId, input }) {
    const choice = state.G.turnMetadata.pendingChoice;
    if (!choice || choice.type !== "chooseCardToMove") {
      return { valid: false, error: "No chooseCardToMove pending", errorCode: "NO_PENDING_CHOICE" };
    }
    if ((choice.chooserId as string) !== (playerId as string)) {
      return { valid: false, error: "Not your choice to resolve", errorCode: "NOT_YOUR_CHOICE" };
    }
    if (input.args.pass) return { valid: true };
    const { cardId } = input.args;
    if (!cardId) {
      return {
        valid: false,
        error: "Must provide cardId or pass:true",
        errorCode: "INVALID_INPUT",
      };
    }
    const typedChoice = choice as ChooseCardToMovePendingChoice;
    if (!typedChoice.payload.cardIds.includes(cardId as CardInstanceId)) {
      return { valid: false, error: "Card is not a valid choice", errorCode: "INVALID_CHOICE" };
    }
    return { valid: true };
  },

  execute({ state, playerId, input, operations }) {
    const choice = state.G.turnMetadata.pendingChoice as ChooseCardToMovePendingChoice;
    const {
      resolvedAttachToId,
      destination,
      boundTargets,
      sourceCardId,
      sourcePlayerId,
      abilityIndex,
      ifEffects,
      elseEffects,
    } = choice.payload;

    operations.game.setPendingChoice(undefined);

    const ctx: ResolutionContext = {
      state,
      sourceCardId,
      sourcePlayerId,
      abilityIndex,
      contextTargets: {},
      boundTargets,
    };

    if (input.args.pass) {
      const followupStatus = executeAbilityEffects(elseEffects, ctx, operations);
      operations.log.emit({
        type: "resolveCardToMove",
        playerId,
        timestamp: Date.now(),
        turnNumber: state.G.turnMetadata.turnNumber,
        passed: true,
      });
      if (followupStatus === "suspended") return;
      resumeCurrentTrigger(state, operations);
      return;
    }

    const { cardId } = input.args;
    if (!cardId) return;

    const card = state.G.cardIndex[cardId];
    if (!card) return;
    const def = tryDefOf(card);
    const cardName = def?.displayName ?? def?.name;

    if (resolvedAttachToId) {
      // Attach-to-unit flow (e.g. Panam): detach gear, move to field, attach to target.
      if (card.meta.attachedToId) {
        operations.card.detachGear(cardId as CardInstanceId);
      }
      operations.zone.moveCard(cardId as CardInstanceId, "field", playerId);
      operations.card.attachGear(cardId as CardInstanceId, resolvedAttachToId as CardInstanceId);
    } else if (destination === "deckBottom") {
      // Bottom-deck flow: remove from current zone, append to bottom of owner's deck.
      const owner = card.ownerId;
      const fromZone = card.zone;
      const player = state.G.players[owner as string];
      if (player) {
        const fromList = player.zones[card.zone];
        const idx = fromList.indexOf(cardId as CardInstanceId);
        if (idx !== -1) fromList.splice(idx, 1);
      }
      operations.zone.moveCardsToBottom(owner, [cardId as CardInstanceId]);
      card.zone = "deck";
      card.meta = createDefaultMetaForZone("deck");
      operations.event.emit({
        type: "cardMoved",
        cardId: cardId as CardInstanceId,
        fromZone,
        toZone: "deck",
        playerId: owner,
      } as any);
    } else {
      // Generic move to a destination zone (e.g. discard to trash).
      const destZone = (destination ?? "trash") as import("@tcg/cyberpunk-types").CardZone;
      if (card.meta.attachedToId) {
        operations.card.detachGear(cardId as CardInstanceId);
      }
      operations.zone.moveCard(cardId as CardInstanceId, destZone, card.ownerId);
    }

    const followupStatus = executeAbilityEffects(ifEffects, ctx, operations);

    operations.log.emit({
      type: "resolveCardToMove",
      playerId,
      timestamp: Date.now(),
      turnNumber: state.G.turnMetadata.turnNumber,
      cardId: cardId as CardInstanceId,
      cardName,
    });
    if (followupStatus === "suspended") return;
    resumeCurrentTrigger(state, operations);
  },
};
