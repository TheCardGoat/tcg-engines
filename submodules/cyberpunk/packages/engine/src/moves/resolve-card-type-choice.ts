import type { CardType } from "@tcg/cyberpunk-types";
import type { MoveDefinition, MoveInput } from "../types/commands.ts";
import type { ChooseCardTypePendingChoice } from "../types/match-state.ts";
import { createDefaultMetaForZone } from "../types/card-instance.ts";
import { resumeCurrentTrigger } from "../ability-executor.ts";
import { defOf } from "../state/lookups.ts";
import { resumeSuspendedEndTurn } from "./pass-phase.ts";

export interface ResolveCardTypeChoiceInput extends MoveInput {
  args: {
    cardType: CardType;
  };
}

export const resolveCardTypeChoiceMove: MoveDefinition<ResolveCardTypeChoiceInput> = {
  handlesPendingChoice: true,

  available({ state, playerId }) {
    const choice = state.G.turnMetadata.pendingChoice;
    return choice?.type === "chooseCardType" && choice.chooserId === playerId;
  },

  validate({ state, playerId, input }) {
    const choice = state.G.turnMetadata.pendingChoice;
    if (!choice || choice.type !== "chooseCardType") {
      return { valid: false, error: "No card-type choice pending", errorCode: "NO_PENDING_CHOICE" };
    }
    if (choice.chooserId !== playerId) {
      return { valid: false, error: "Not your card-type choice", errorCode: "WRONG_CHOOSER" };
    }
    if (!choice.payload.cardTypes.includes(input.args.cardType)) {
      return { valid: false, error: "Card type is not allowed", errorCode: "INVALID_CARD_TYPE" };
    }
    return { valid: true };
  },

  execute({ state, playerId, input, operations }) {
    const choice = state.G.turnMetadata.pendingChoice as ChooseCardTypePendingChoice;
    const player = state.G.players[playerId as string];
    const cardId = player?.zones.deck.shift();

    operations.game.setPendingChoice(undefined);
    if (!player || !cardId) {
      resumeCurrentTrigger(state, operations);
      resumeSuspendedEndTurn(state, operations);
      return;
    }

    const card = state.G.cardIndex[cardId as string];
    const hit = card ? defOf(card).type === input.args.cardType : false;
    operations.event.emit({
      type: "cardsRevealed",
      cardIds: [cardId],
      playerId,
    });

    if (hit) {
      if (card) {
        card.zone = "hand";
        card.meta = createDefaultMetaForZone("hand");
      }
      player.zones.hand.push(cardId);
      if (player.spentEddies > 0) {
        player.spentEddies -= 1;
        player.eddies += 1;
        operations.event.emit({ type: "eddiesGained", playerId, amount: 1 });
      }
    } else {
      if (card) {
        card.zone = "trash";
        card.meta = createDefaultMetaForZone("trash");
      }
      player.zones.trash.push(cardId);
    }

    operations.event.emit({
      type: "actionLog",
      messageKey: hit ? "trigger.revealTopCardType.hit" : "trigger.revealTopCardType.miss",
      params: {
        chosenType: input.args.cardType,
        revealedType: card ? defOf(card).type : "unknown",
        sourceCardName: state.G.cardIndex[choice.payload.sourceCardId as string]
          ? defOf(state.G.cardIndex[choice.payload.sourceCardId as string]!).displayName
          : "That effect",
      },
      playerId,
      category: "trigger",
      cardIds: [choice.payload.sourceCardId as string, cardId as string],
    });

    resumeCurrentTrigger(state, operations);
    resumeSuspendedEndTurn(state, operations);
  },
};
