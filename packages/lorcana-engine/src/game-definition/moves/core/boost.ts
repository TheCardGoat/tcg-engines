import { type ZoneId, createMove } from "@tcg/core";
import type { LorcanaCardDefinition } from "@tcg/lorcana-types";
import { getBoostValue } from "../../../card-utils";
import { useLorcanaOps } from "../../../operations";
import type { LorcanaCardMeta, LorcanaGameState, LorcanaMoveParams } from "../../../types";
import {
  and,
  cardInPlay,
  cardOwnedByPlayer,
  hasNotUsedAction,
  isMainPhase,
} from "../../../validators";

/**
 * Boost Move
 *
 * Rule 10.2: Once during your turn, you may pay X {I} to put the top card
 * of your deck facedown under a character with "Boost X".
 *
 * Key rules:
 * - Boost can be used the same turn the character is played (no drying restriction)
 * - Only usable once per character per turn (tracked with "boosted:<cardId>")
 * - Requires X ready ink cards in the inkwell
 * - Top card of deck goes facedown under the character (moved to limbo zone)
 * - If deck is empty, Boost cannot be activated
 */
export const boostMove = createMove<
  LorcanaGameState,
  LorcanaMoveParams,
  "boost",
  LorcanaCardMeta
>({
  condition: and(
    isMainPhase(),
    // Character must be in play and owned by current player
    (state, context) => cardInPlay(context.params.characterId)(state, context),
    (state, context) => cardOwnedByPlayer(context.params.characterId)(state, context),
    // Character must have Boost keyword
    (_state, context) => {
      const definition = context.registry?.getCard(
        context.params.characterId,
      ) as LorcanaCardDefinition | undefined;
      return definition !== undefined && getBoostValue(definition) !== null;
    },
    // Boost has not already been used for this character this turn
    (state, context) =>
      hasNotUsedAction(`boosted:${context.params.characterId}`)(state, context),
    // Deck must have at least one card
    (_state, context) => {
      const deckCards = context.zones.getCardsInZone("deck" as ZoneId, context.playerId);
      return deckCards.length > 0;
    },
    // Player must have enough ready ink to pay the Boost cost
    (_state, context) => {
      const definition = context.registry?.getCard(
        context.params.characterId,
      ) as LorcanaCardDefinition | undefined;
      if (!definition) {return false;}
      const boostCost = getBoostValue(definition);
      if (boostCost === null) {return false;}

      const inkCards = context.zones.getCardsInZone("inkwell" as ZoneId, context.playerId);
      const readyInkCount = inkCards.filter((inkCardId) => {
        const meta = context.cards.getCardMeta(inkCardId);
        return meta?.state === "ready";
      }).length;

      return readyInkCount >= boostCost;
    },
  ),
  reducer: (_draft, context) => {
    const { characterId } = context.params;
    const ops = useLorcanaOps(context);

    const definition = context.registry?.getCard(characterId) as
      | LorcanaCardDefinition
      | undefined;
    if (!definition) {return;}

    const boostCost = getBoostValue(definition);
    if (boostCost === null) {return;}

    // Pay the ink cost by exerting boostCost ready inkwell cards
    const inkCards = context.zones.getCardsInZone("inkwell" as ZoneId, context.playerId);
    let inkPaid = 0;
    for (const inkCardId of inkCards) {
      if (inkPaid >= boostCost) {break;}
      const meta = context.cards.getCardMeta(inkCardId);
      if (meta?.state === "ready") {
        ops.exertCard(inkCardId);
        inkPaid++;
      }
    }

    // Get the top card of the deck
    const deckCards = context.zones.getCardsInZone("deck" as ZoneId, context.playerId);
    const topCardId = deckCards[0];
    if (!topCardId) {return;}

    // Move the top deck card to limbo (represents facedown under the character)
    context.zones.moveCard({
      cardId: topCardId,
      targetZoneId: "limbo" as ZoneId,
    });

    // Update the character's stack position to track cards underneath
    const characterMeta = context.cards.getCardMeta(characterId);
    const existingUnder = characterMeta?.stackPosition?.cardsUnderneath ?? [];
    context.cards.updateCardMeta(characterId, {
      stackPosition: {
        cardsUnderneath: [...existingUnder, topCardId],
        isUnder: false,
      },
    });

    // Track that the moved card is underneath this character
    context.cards.updateCardMeta(topCardId, {
      stackPosition: {
        isUnder: true,
        topCardId: characterId,
      },
    });

    // Mark Boost as used for this character this turn
    context.trackers?.mark(`boosted:${characterId}`, context.playerId);
  },
});
