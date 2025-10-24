import {
  type CardId,
  type ConditionFailure,
  createMove,
  type PlayerId,
  type ZoneId,
} from "@tcg/core";
import type {
  LorcanaCardMeta,
  LorcanaGameState,
  LorcanaMoveParams,
} from "../../../types";

/**
 * Alter Hand Move (Mulligan)
 *
 * Rule 3.1.6: Players may mulligan by putting cards on bottom of deck
 *
 * Lorcana-specific mulligan process:
 * 1. Step 1 (Rule 3.1.6.1): Put selected cards on BOTTOM of deck (not shuffled in)
 * 2. Step 2 (Rule 3.1.6.2): Draw until player has 7 cards
 * 3. Step 4 (Rule 3.1.6.4): Shuffle deck ONLY if 1+ cards were returned
 * 4. Priority passes to next player who needs to mulligan
 * 5. When all done, transition to main game
 */
export const alterHand = createMove<
  LorcanaGameState,
  LorcanaMoveParams,
  "alterHand",
  LorcanaCardMeta
>({
  // Enumerator: Returns targeting constraints for UI/AI
  // UI will present card selection interface: "Select 0-7 cards from your hand to mulligan"
  // AI can enumerate all valid combinations based on these constraints
  enumerator: (state, context) => {
    // Get cards in hand for validation constraints
    const handCards =
      context.zones?.getCardsInZone("hand" as ZoneId, context.playerId) || [];

    // Return single parameter set with targeting information
    // The targeting system will handle enumerating card combinations
    return [
      {
        playerId: context.playerId,
        cardsToMulligan: [], // Default: keep all cards
        // Include validation constraints for UI/AI
        validation: {
          maxCards: Math.min(7, handCards.length),
          validCards: handCards,
        },
        // TODO: Integrate with targeting system DSL
        // target: {
        //   filter: {
        //     zone: "hand" as ZoneId,
        //     owner: context.playerId
        //   },
        //   count: { min: 0, max: 7 }
        // }
      },
    ];
  },

  condition: (state, context): true | ConditionFailure => {
    const { playerId, cardsToMulligan } = context.params;

    // 1. Check we're in the correct phase
    if (context.flow?.currentPhase !== "mulligan") {
      return {
        reason: `Cannot mulligan during ${context.flow?.currentPhase || "unknown"} phase. Must be in mulligan phase.`,
        errorCode: "WRONG_PHASE",
        context: {
          currentPhase: context.flow?.currentPhase,
          requiredPhase: "mulligan",
        },
      };
    }

    // 2. Check player is in pending mulligan list
    const pendingMulligan = context.game.getPendingMulligan();
    if (!pendingMulligan.includes(playerId)) {
      return {
        reason: `Player ${String(playerId)} has already mulliganed or is not eligible to mulligan.`,
        errorCode: "ALREADY_MULLIGANED",
        context: {
          playerId: String(playerId),
          pendingPlayers: pendingMulligan.map((p) => String(p)),
        },
      };
    }

    // 3. Check player has priority (is current player)
    const currentPlayer = context.flow?.currentPlayer;
    if (currentPlayer !== playerId) {
      return {
        reason: `Only ${String(currentPlayer)} can mulligan right now. You are ${String(playerId)}.`,
        errorCode: "NOT_PRIORITY_PLAYER",
        context: {
          currentPlayer: String(currentPlayer),
          executingPlayer: String(playerId),
        },
      };
    }

    // 4. Validate all card IDs are valid
    for (const cardId of cardsToMulligan) {
      const cardZone = context.zones.getCardZone(cardId);
      if (cardZone === undefined) {
        return {
          reason: `Invalid card ID: ${cardId}. Card does not exist in any zone.`,
          errorCode: "INVALID_CARD_ID",
          context: {
            cardId,
          },
        };
      }
    }

    // 5. Validate all cards are in player's hand
    const handCards = context.zones.getCardsInZone("hand" as ZoneId, playerId);
    for (const cardId of cardsToMulligan) {
      if (!handCards.includes(cardId)) {
        const cardZone = context.zones.getCardZone(cardId);
        const cardOwner = context.cards.getCardOwner(cardId);

        return {
          reason: `Card ${cardId} is not in your hand. It's in ${cardZone || "unknown zone"} owned by ${cardOwner || "unknown"}.`,
          errorCode: "CARD_NOT_IN_HAND",
          context: {
            cardId,
            cardZone,
            cardOwner: String(cardOwner),
            playerId: String(playerId),
          },
        };
      }
    }

    // 6. Validate cards to mulligan don't exceed hand size
    if (cardsToMulligan.length > handCards.length) {
      return {
        reason: `Cannot mulligan ${cardsToMulligan.length} cards when hand only has ${handCards.length} cards.`,
        errorCode: "TOO_MANY_CARDS",
        context: {
          requested: cardsToMulligan.length,
          handSize: handCards.length,
        },
      };
    }

    return true;
  },

  reducer: (draft, context) => {
    const { playerId, cardsToMulligan } = context.params;

    // Rule 3.1.6.1: Put selected cards on BOTTOM of deck (not shuffled in yet)
    if (cardsToMulligan.length > 0) {
      for (const cardId of cardsToMulligan) {
        context.zones.moveCard({
          cardId,
          targetZoneId: "deck" as ZoneId,
          position: "bottom", // Lorcana-specific: cards go to bottom
        });
      }
    }

    // Rule 3.1.6.2: Draw until player has 7 cards
    const currentHandSize = context.zones.getCardsInZone(
      "hand" as ZoneId,
      playerId,
    ).length;
    const cardsToDraw = 7 - currentHandSize;

    if (cardsToDraw > 0) {
      const drawnCards = context.zones.drawCards({
        from: "deck" as ZoneId,
        to: "hand" as ZoneId,
        count: cardsToDraw,
        playerId,
      });

      // Validate that we drew enough cards (deck exhaustion check)
      if (drawnCards.length < cardsToDraw) {
        throw new Error(
          `Cannot complete mulligan: deck exhausted. Needed to draw ${cardsToDraw} cards but only drew ${drawnCards.length}. This violates Lorcana Rule 3.1.6.2 (must have exactly 7 cards after mulligan).`,
        );
      }
    }

    // Rule 3.1.6.4: Shuffle deck ONLY if 1 or more cards were altered
    if (cardsToMulligan.length > 0) {
      context.zones.shuffleZone("deck" as ZoneId, playerId);
    }

    // Remove player from pending mulligan list
    context.game.removePendingMulligan(playerId);

    // Switch priority to the next pending player
    const pendingMulligan = context.game.getPendingMulligan();

    if (pendingMulligan.length > 0) {
      if (context.flow?.setCurrentPlayer) {
        // Set priority to the next player who needs to mulligan
        context.flow.setCurrentPlayer(pendingMulligan[0]);
      }
    }
    // When all players complete mulligan (pending list empty), flow manager
    // will auto-transition via its endIf condition on next move attempt or flow check
  },
});
