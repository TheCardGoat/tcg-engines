import type { CardInstanceId } from "../types/branded.ts";
import type { MoveDefinition, MoveInput } from "../types/commands.ts";
import type { SearchDeckPendingChoice } from "../types/match-state.ts";
import { defOf } from "../state/lookups.ts";
import { resumeCurrentTrigger } from "../ability-executor.ts";
import { createDefaultMetaForZone } from "../types/card-instance.ts";

export interface ResolveSearchDeckInput extends MoveInput {
  args: {
    selectedCardIds: string[];
  };
}

export const resolveSearchDeckMove: MoveDefinition<ResolveSearchDeckInput> = {
  handlesPendingChoice: true,

  available({ state, playerId }) {
    const choice = state.G.turnMetadata.pendingChoice;
    if (!choice || choice.type !== "searchDeck") return false;
    return (choice.chooserId as string) === (playerId as string);
  },

  validate({ state, playerId, input }) {
    const choice = state.G.turnMetadata.pendingChoice;
    if (!choice || choice.type !== "searchDeck") {
      return { valid: false, error: "No searchDeck pending", errorCode: "NO_PENDING_CHOICE" };
    }
    if ((choice.chooserId as string) !== (playerId as string)) {
      return { valid: false, error: "Not your choice", errorCode: "NOT_YOUR_CHOICE" };
    }

    const typedChoice = choice as SearchDeckPendingChoice;
    const { selectedCardIds } = input.args;
    const select = typedChoice.payload.select;
    const maxSelect =
      select?.kind === "upTo" ? select.max : select?.kind === "exact" ? select.amount : 0;

    if (selectedCardIds.length > maxSelect) {
      return {
        valid: false,
        error: `Cannot select more than ${maxSelect} card(s)`,
        errorCode: "TOO_MANY_SELECTED",
      };
    }

    // Validate that selected cards are within the snapshotted search window
    const revealedCardIds = typedChoice.payload.revealedCardIds;

    for (const cardId of selectedCardIds) {
      if (!revealedCardIds.includes(cardId as CardInstanceId)) {
        return {
          valid: false,
          error: "Selected card is not in the search window",
          errorCode: "INVALID_CHOICE",
        };
      }

      // Validate the card matches the target filter
      const card = state.G.cardIndex[cardId];
      if (!card) {
        return { valid: false, error: "Card not found", errorCode: "CARD_NOT_FOUND" };
      }

      const target = typedChoice.payload.target as any;
      const cardDef = defOf(card);
      if (target?.cardTypes && !target.cardTypes.includes(cardDef.type)) {
        return {
          valid: false,
          error: "Card does not match required type",
          errorCode: "INVALID_CARD_TYPE",
        };
      }
      if (target?.classifications) {
        const cardClassifications = (cardDef as any).classifications ?? [];
        const hasMatch = target.classifications.some((c: string) =>
          cardClassifications.includes(c),
        );
        if (!hasMatch) {
          return {
            valid: false,
            error: "Card does not match required classification",
            errorCode: "INVALID_CLASSIFICATION",
          };
        }
      }
      if (target?.maxCost !== undefined) {
        const cardCost = cardDef.cost ?? 0;
        if (cardCost > target.maxCost) {
          return {
            valid: false,
            error: "Card cost exceeds maximum",
            errorCode: "INVALID_COST",
          };
        }
      }
    }

    return { valid: true };
  },

  execute({ state, playerId, input, operations }) {
    const choice = state.G.turnMetadata.pendingChoice as SearchDeckPendingChoice;
    const { selectedCardIds } = input.args;
    const player = state.G.players[playerId as string];
    if (!player) return;

    const revealedCardIds = choice.payload.revealedCardIds;
    const selectedSet = new Set(selectedCardIds);

    // Remove revealed cards from deck (they were snapshotted at creation time)
    for (const cardId of revealedCardIds) {
      const idx = player.zones.deck.indexOf(cardId);
      if (idx !== -1) player.zones.deck.splice(idx, 1);
    }

    const destination = choice.payload.destination ?? "hand";

    // Move selected cards to destination
    for (const cardId of selectedCardIds) {
      const card = state.G.cardIndex[cardId as string];
      if (!card) continue;
      card.zone = destination as any;
      card.meta = createDefaultMetaForZone(destination as import("@tcg/cyberpunk-types").CardZone);
      player.zones[destination as keyof typeof player.zones].push(cardId as CardInstanceId);
    }

    // Handle remainder cards (non-selected revealed cards)
    const remainder = revealedCardIds.filter((id) => !selectedSet.has(id as string));
    const remainderZone = (choice.payload.remainder as any)?.zone ?? "deckBottom";

    if (remainderZone === "trash") {
      for (const cardId of remainder) {
        const card = state.G.cardIndex[cardId as string];
        if (card) {
          card.zone = "trash" as any;
          card.meta = createDefaultMetaForZone("trash");
        }
        player.zones.trash.push(cardId);
      }
    } else {
      for (const cardId of remainder) {
        player.zones.deck.push(cardId);
      }
    }

    operations.game.setPendingChoice(undefined);

    const foundCount = selectedCardIds.length;
    operations.event.emit({
      type: "searchPerformed",
      playerId,
      zone: "deck",
      found: foundCount,
    });

    operations.event.emit({
      type: "actionLog",
      messageKey: "move.resolveSearchDeck",
      params: {
        count: foundCount,
        looked: revealedCardIds.length,
      },
      playerId,
      category: "search",
      cardIds: selectedCardIds,
    });

    resumeCurrentTrigger(state, operations);
  },
};
