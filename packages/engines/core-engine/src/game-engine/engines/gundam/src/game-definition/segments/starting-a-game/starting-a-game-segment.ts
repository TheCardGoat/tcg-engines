import type { SegmentConfig } from "~/game-engine/core-engine/game/structure/segment";
import { logger } from "~/game-engine/core-engine/utils/logger";
import { exResourceToken } from "~/game-engine/engines/gundam/src/cards/definitions/tokens/tokens";
import type { GundamGameState } from "~/game-engine/engines/gundam/src/gundam-engine-types";
import { gundamMoves } from "~/game-engine/engines/gundam/src/moves/moves";

// 5-2. Before the Game
// 5-2-1. Before the game starts, each player follows the steps listed below.
// 5-2-1-1. Present the deck and resource deck you will use in the game. The deck and resource deck must conform to the rules on deck construction explained in 5-1.
// 5-2-1-2. Each player thoroughly shuffles their deck. When finished, each player places their deck face down in their deck area.
// 5-2-1-3. Each player places their resource deck face down in their resource deck area.
// 5-2-1-4. Both players determine Player One and Player Two using a method such as rock paper scissors. The winner decides who becomes Player One.
// 5-2-1-5. Each player draws five cards from their deck, which become their starting hand.
// 5-2-1-6. Then, starting with Player One, each player decides if they will redraw their hand one time according to the rules explained below. Players are not required to redraw if they do not wish to.
// 5-2-1-6-1. If you decide to redraw, return your entire hand to the bottom of your deck and draw five new cards, which will become your new starting hand. Then, shuffle your deck.
// 5-2-1-7. After Player One has announced whether or not they will redraw, Player Two may redraw according to the same rules explained in 5-2-1-6-1 above.
// 5-2-2. Each player takes the top six cards of their deck, one at a time, and places them face down into the shield section of their shield area without looking at them. When doing so, place each card so it overlaps the previous one, starting with the card nearest to you.
// 5-2-3. Each player places one active EX Base token card into the base section of their shield area.
// 5-2-4. Player Two places one active EX Resource token card into their resource area.

export const startingAGameSegment: SegmentConfig<GundamGameState> = {
  next: "duringGame",

  onBegin: ({ G, coreOps }) => {
    coreOps.setPendingMulligan(coreOps.getPlayers());
    logger.info("==== STARTING A GAME ====");

    for (const player of coreOps.getPlayers()) {
      coreOps.shuffleZone("deck", player);
    }

    return G;
  },

  endIf: ({ ctx }) => {
    // Segment ends when:
    // 1. A first player is chosen
    // 2. Mulligan phase has started (pendingMulligan is set)
    // 3. All players have completed their mulligan decisions
    return (
      ctx.otp !== undefined &&
      ctx.pendingMulligan !== undefined &&
      ctx.pendingMulligan.size === 0
    );
  },

  onEnd: ({ G, ctx, coreOps }) => {
    if (ctx.otp) {
      coreOps.setPriorityPlayer(ctx.otp);
      coreOps.setTurnPlayer(ctx.otp);
      // Clear pending mulligan since all players have decided
      coreOps.setPendingMulligan(undefined);
    }

    // 5-2-2. Each player takes the top six cards of their deck, one at a time,
    // and places them face down into the shield section of their shield area
    logger.info("Placing shield section cards for both players");
    for (const player of coreOps.getPlayers()) {
      const cardsInDeck = coreOps.getZone("deck", player).cards.length;
      const cardsToPlace = 6;
      const numToPlace = Math.min(cardsToPlace, cardsInDeck);

      for (let i = 0; i < numToPlace; i++) {
        coreOps.moveCard({
          playerId: player,
          from: "deck",
          to: "shieldSection",
          destination: "end",
        });
      }
    }

    // 5-2-4. Player Two places one active EX Resource token card into their resource area
    logger.info("Placing EX Resource token for Player Two");
    const playerTwo = coreOps.getPlayers()[1]; // Assuming player order [player_one, player_two]
    if (playerTwo) {
      // Find the EX Resource token in Player Two's sideboard
      const sideboardZone = coreOps.getZone("sideboard", playerTwo);
      const playerCards = ctx.cards[playerTwo] || {};
      let exResourceTokenInstanceId: string | null = null;

      // Find the EX Resource token instance ID in the sideboard
      for (const instanceId of sideboardZone.cards) {
        const cardId = playerCards[instanceId];
        if (cardId === exResourceToken.id) {
          exResourceTokenInstanceId = instanceId;
          break;
        }
      }

      if (exResourceTokenInstanceId) {
        // Move the existing token from sideboard to resource area
        coreOps.moveCard({
          playerId: playerTwo,
          instanceId: exResourceTokenInstanceId,
          from: "sideboard",
          to: "resourceArea",
          destination: "end",
        });

        logger.info(
          `Moved EX Resource token ${exResourceTokenInstanceId} to ${playerTwo}'s resource area`,
        );
      } else {
        logger.warn(`EX Resource token not found in ${playerTwo}'s sideboard`);
      }
    }

    return G;
  },

  turn: {
    phases: {
      chooseFirstPlayer: {
        start: true,
        next: "redrawHand",
        allowAnyPlayerToAct: true, // Allow either player to choose who goes first (5-2-1-4)

        endIf: ({ ctx }) => {
          return ctx.otp !== undefined;
        },

        moves: {
          chooseFirstPlayer: gundamMoves.chooseFirstPlayer,
        },
      },
      redrawHand: {
        endIf: ({ ctx }) => {
          // Phase ends when all players have made their mulligan decision
          // ctx.pendingMulligan contains players who haven't decided yet
          return !ctx.pendingMulligan || ctx.pendingMulligan.size === 0;
        },

        onBegin: ({ G, ctx, coreOps }) => {
          coreOps.setPriorityPlayer(ctx.otp);
          coreOps.setTurnPlayer(ctx.otp);
          coreOps.setPendingMulligan(coreOps.getPlayers());

          // 5-2-1-5. Each player draws five cards from their deck, which become their starting hand.
          logger.info("Drawing starting hands for both players");
          for (const player of coreOps.getPlayers()) {
            const handZone = coreOps.getZone("hand", player);
            const cardsInHand = handZone.cards.length;

            // Only draw cards if player doesn't already have a hand (for tests)
            if (cardsInHand === 0) {
              const cardsInDeck = coreOps.getZone("deck", player).cards.length;
              const cardsToDraw = 5;
              const numToDraw = Math.min(cardsToDraw, cardsInDeck);

              for (let i = 0; i < numToDraw; i++) {
                coreOps.moveCard({
                  playerId: player,
                  from: "deck",
                  to: "hand",
                  destination: "end",
                });
              }
            }
          }

          return G;
        },

        onEnd: ({ G, ctx, coreOps }) => {
          if (ctx.otp) {
            coreOps.setPriorityPlayer(ctx.otp);
            coreOps.setTurnPlayer(ctx.otp);
            // Clear pending mulligan since all players have decided
            coreOps.setPendingMulligan(undefined);
          }

          return G;
        },

        moves: {
          redrawHand: gundamMoves.redrawHand,
        },
      },
    },
  },
};
