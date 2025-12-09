import { logger } from "~/game-engine/core-engine/utils/logger";
import { onePieceMoves } from "~/game-engine/engines/one-piece/src/moves/moves";
/**
 * Starting a Game Segment for One Piece TCG
 *
 * Based on One Piece TCG rules:
 * 1. Choose first player
 * 2. Each player draws 5 cards for starting hand
 * 3. Each player may mulligan once (redraw entire hand)
 * 4. Set Life cards equal to Leader's life value
 * 5. Place 10 DON!! cards in DON!! deck
 * 6. First player places 1 DON!! in cost area, second player places 2
 */
export const startingAGameSegment = {
    next: "duringGame",
    onBegin: ({ G, coreOps }) => {
        coreOps.setPendingMulligan(coreOps.getPlayers());
        logger.info("==== STARTING ONE PIECE GAME ====");
        // Shuffle all player decks
        for (const player of coreOps.getPlayers()) {
            coreOps.shuffleZone("deck", player);
            coreOps.shuffleZone("donDeck", player);
        }
        return G;
    },
    endIf: ({ ctx }) => {
        // Segment ends when:
        // 1. A first player is chosen
        // 2. All players have completed their mulligan decisions
        // 3. Life cards have been set
        return (ctx.otp !== undefined &&
            ctx.pendingMulligan !== undefined &&
            ctx.pendingMulligan.size === 0);
    },
    onEnd: ({ G, ctx, coreOps }) => {
        if (ctx.otp) {
            coreOps.setPriorityPlayer(ctx.otp);
            coreOps.setTurnPlayer(ctx.otp);
            coreOps.setPendingMulligan(undefined);
        }
        // Set Life cards for each player based on their Leader's life value
        logger.info("Setting Life cards for both players");
        for (const player of coreOps.getPlayers()) {
            const leaderZone = coreOps.getZone("leaderArea", player);
            const playerCards = ctx.cards[player] || {};
            // Find leader card to determine life value
            const leaderLifeValue = 5; // Default life value
            if (leaderZone.cards.length > 0) {
                const leaderInstanceId = leaderZone.cards[0];
                const leaderCardId = playerCards[leaderInstanceId];
                // TODO: Get leader definition from card repository when available
                // For now, use default life value
                // const leaderCard = coreOps.cardRepository?.getCardByPublicId?.(leaderCardId);
                // if (leaderCard && "life" in leaderCard) {
                //   leaderLifeValue = leaderCard.life;
                // }
            }
            // Move cards from deck to life area (face-down)
            const cardsInDeck = coreOps.getZone("deck", player).cards.length;
            const cardsToPlace = Math.min(leaderLifeValue, cardsInDeck);
            for (let i = 0; i < cardsToPlace; i++) {
                coreOps.moveCard({
                    playerId: player,
                    from: "deck",
                    to: "lifeArea",
                    destination: "end",
                });
            }
            logger.info(`Set ${cardsToPlace} Life cards for ${player}`);
        }
        // Place initial DON!! cards in cost area
        logger.info("Placing initial DON!! cards in cost area");
        const players = coreOps.getPlayers();
        const firstPlayer = ctx.otp;
        const secondPlayer = players.find((p) => p !== firstPlayer);
        // First player gets 1 DON!!, second player gets 2 DON!!
        if (firstPlayer) {
            placeDonCardsInCostArea(coreOps, ctx, firstPlayer, 1);
        }
        if (secondPlayer) {
            placeDonCardsInCostArea(coreOps, ctx, secondPlayer, 2);
        }
        return G;
    },
    turn: {
        phases: {
            chooseFirstPlayer: {
                start: true,
                next: "mulligan",
                endIf: ({ ctx }) => {
                    return ctx.otp !== undefined;
                },
                moves: {
                    chooseFirstPlayer: onePieceMoves.chooseFirstPlayer,
                },
            },
            mulligan: {
                endIf: ({ ctx }) => {
                    // Phase ends when all players have made their mulligan decision
                    return !ctx.pendingMulligan || ctx.pendingMulligan.size === 0;
                },
                onBegin: ({ G, ctx, coreOps }) => {
                    coreOps.setPriorityPlayer(ctx.otp);
                    coreOps.setTurnPlayer(ctx.otp);
                    coreOps.setPendingMulligan(coreOps.getPlayers());
                    // Each player draws 5 cards for starting hand
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
                        coreOps.setPendingMulligan(undefined);
                    }
                    return G;
                },
                moves: {
                    mulligan: onePieceMoves.mulligan,
                },
            },
        },
    },
};
/**
 * Helper function to place DON!! cards from DON!! deck to cost area
 */
function placeDonCardsInCostArea(coreOps, ctx, playerId, count) {
    const donDeckZone = coreOps.getZone("donDeck", playerId);
    const cardsInDonDeck = donDeckZone.cards.length;
    const cardsToPlace = Math.min(count, cardsInDonDeck);
    for (let i = 0; i < cardsToPlace; i++) {
        coreOps.moveCard({
            playerId: playerId,
            from: "donDeck",
            to: "costArea",
            destination: "end",
        });
    }
    logger.info(`Placed ${cardsToPlace} DON!! cards in ${playerId}'s cost area`);
}
//# sourceMappingURL=starting-a-game-segment.js.map