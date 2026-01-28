/**
 * Riftbound Card Play Moves
 *
 * Moves for playing cards: units, gear, spells, and hidden cards.
 */

import type {
  CardId as CoreCardId,
  PlayerId as CorePlayerId,
  ZoneId as CoreZoneId,
  GameMoveDefinitions,
} from "@tcg/core";
import type {
  RiftboundCardMeta,
  RiftboundGameState,
  RiftboundMoves,
} from "../../types";
import {
  getBattlefieldZoneId,
  getFacedownZoneId,
} from "../../zones/zone-configs";

/**
 * Card play move definitions
 */
export const cardPlayMoves: Partial<
  GameMoveDefinitions<
    RiftboundGameState,
    RiftboundMoves,
    RiftboundCardMeta,
    unknown
  >
> = {
  /**
   * Play a unit to Base or Battlefield
   *
   * Units can be played to:
   * - Player's Base
   * - A Battlefield the player controls
   *
   * Units enter exhausted by default (unless Accelerate is paid).
   */
  playUnit: {
    reducer: (_draft, context) => {
      const { cardId, location } = context.params;
      const { zones, counters } = context;

      // Move unit from hand to the target location
      zones.moveCard({
        cardId: cardId as CoreCardId,
        targetZoneId: location as CoreZoneId,
      });

      // Units enter exhausted by default
      counters.setFlag(cardId as CoreCardId, "exhausted", true);
    },
  },

  /**
   * Play gear to Base
   *
   * Gear can only be played to the player's Base.
   */
  playGear: {
    reducer: (_draft, context) => {
      const { cardId } = context.params;
      const { zones } = context;

      // Move gear from hand to base
      zones.moveCard({
        cardId: cardId as CoreCardId,
        targetZoneId: "base" as CoreZoneId,
      });
    },
  },

  /**
   * Play a spell
   *
   * Spells go to the Chain for resolution, then to Trash.
   * In the tabletop simulator, we move directly to Trash
   * since players handle resolution manually.
   */
  playSpell: {
    reducer: (_draft, context) => {
      const { cardId } = context.params;
      const { zones } = context;

      // Move spell from hand to trash (after resolution)
      zones.moveCard({
        cardId: cardId as CoreCardId,
        targetZoneId: "trash" as CoreZoneId,
      });
    },
  },

  /**
   * Hide a card at a Battlefield
   *
   * Cards with the Hidden keyword can be placed facedown
   * at a Battlefield the player controls.
   * Cost: 1 Power matching Domain Identity
   */
  hideCard: {
    reducer: (_draft, context) => {
      const { cardId, battlefieldId } = context.params;
      const { zones, counters, cards } = context;

      // Get the facedown zone for this battlefield
      const facedownZoneId = getFacedownZoneId(battlefieldId);

      // Move card from hand to facedown zone
      zones.moveCard({
        cardId: cardId as CoreCardId,
        targetZoneId: facedownZoneId as CoreZoneId,
      });

      // Mark card as hidden
      counters.setFlag(cardId as CoreCardId, "hidden", true);

      // Store which battlefield it's hidden at
      cards.updateCardMeta(
        cardId as CoreCardId,
        {
          hidden: true,
          hiddenAt: battlefieldId,
        } as Partial<RiftboundCardMeta>,
      );
    },
  },

  /**
   * Reveal and play a hidden card
   *
   * Reveals a facedown card and plays it.
   * The card gains Reaction timing when played from hidden.
   */
  revealHidden: {
    reducer: (_draft, context) => {
      const { cardId } = context.params;
      const { zones, counters, cards } = context;

      // Get the card's hidden location
      const meta = cards.getCardMeta(
        cardId as CoreCardId,
      ) as Partial<RiftboundCardMeta>;
      const battlefieldId = meta.hiddenAt;

      if (battlefieldId) {
        // Get the battlefield zone
        const battlefieldZoneId = getBattlefieldZoneId(battlefieldId);

        // Move card from facedown zone to battlefield
        zones.moveCard({
          cardId: cardId as CoreCardId,
          targetZoneId: battlefieldZoneId as CoreZoneId,
        });
      }

      // Clear hidden state
      counters.setFlag(cardId as CoreCardId, "hidden", false);
      cards.updateCardMeta(
        cardId as CoreCardId,
        {
          hidden: false,
          hiddenAt: undefined,
        } as Partial<RiftboundCardMeta>,
      );
    },
  },

  /**
   * Play Chosen Champion from Champion Zone
   *
   * The Chosen Champion can be played from the Champion Zone
   * to Base or a controlled Battlefield.
   */
  playFromChampionZone: {
    reducer: (_draft, context) => {
      const { playerId, location } = context.params;
      const { zones, counters } = context;

      // Get the champion from the champion zone
      const championZoneCards = zones.getCardsInZone(
        "championZone" as CoreZoneId,
        playerId as CorePlayerId,
      );

      if (championZoneCards.length > 0) {
        const championId = championZoneCards[0];
        if (championId) {
          // Move champion to the target location
          zones.moveCard({
            cardId: championId,
            targetZoneId: location as CoreZoneId,
          });

          // Champion enters exhausted by default
          counters.setFlag(championId, "exhausted", true);
        }
      }
    },
  },
};
