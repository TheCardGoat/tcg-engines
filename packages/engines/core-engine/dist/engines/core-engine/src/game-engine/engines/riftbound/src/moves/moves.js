/**
 * Move implementations for Riftbound TCG
 * Following the CoreEngine move pattern with proper ctx usage
 */
import { createInvalidMove } from "~/game-engine/core-engine/move/move-types";
import { getCurrentPriorityPlayer, getCurrentTurnPlayer, } from "~/game-engine/core-engine/state/context";
import { logger } from "~/game-engine/core-engine/utils/logger";
/**
 * Setup and pregame moves
 */
export const chooseDomainIdentity = ({ G, ctx, playerID, coreOps }, domains) => {
    if (!playerID) {
        logger.warn("chooseDomainIdentity: No player ID provided");
        return createInvalidMove("NO_PLAYER_ID", "moves.chooseDomainIdentity.errors.noPlayerId");
    }
    // Validate domain selection
    if (domains.length === 0 || domains.length > 6) {
        logger.warn("chooseDomainIdentity: Must choose 1-6 domains");
        return createInvalidMove("INVALID_DOMAIN_COUNT", "moves.chooseDomainIdentity.errors.invalidDomainCount", { domainCount: domains.length, maxDomains: 6 });
    }
    // Check for duplicates
    const uniqueDomains = new Set(domains);
    if (uniqueDomains.size !== domains.length) {
        logger.warn("chooseDomainIdentity: Cannot select duplicate domains");
        return createInvalidMove("DUPLICATE_DOMAINS", "moves.chooseDomainIdentity.errors.duplicateDomains", { domains });
    }
    // Use CoreOperation to manipulate player state
    const player = ctx.players[playerID];
    if (!player) {
        logger.warn(`chooseDomainIdentity: Player ${playerID} not found`);
        return createInvalidMove("PLAYER_NOT_FOUND", "moves.chooseDomainIdentity.errors.playerNotFound", { playerId: playerID });
    }
    // Set domain identity through player state (TODO: Implement proper domain identity setting)
    // For now, we'll just log the action as domain identity is game-specific
    logger.info(`Player ${playerID} chose domain identity: ${domains.join(", ")}`);
    return G;
};
export const chooseFirstPlayer = ({ G, ctx, playerID, coreOps }, params) => {
    if (!playerID) {
        logger.warn("chooseFirstPlayer: No player ID provided");
        return createInvalidMove("NO_PLAYER_ID", "moves.chooseFirstPlayer.errors.noPlayerId");
    }
    const firstPlayerId = params.playerId;
    if (!ctx.playerOrder.includes(firstPlayerId)) {
        logger.warn(`chooseFirstPlayer: Player ${firstPlayerId} is not in this game`);
        return createInvalidMove("PLAYER_NOT_IN_GAME", "moves.chooseFirstPlayer.errors.playerNotInGame", { playerId: firstPlayerId, availablePlayers: ctx.playerOrder });
    }
    // Set the first player through coreOps operations
    coreOps.setOTP(firstPlayerId);
    coreOps.setPriorityPlayer(firstPlayerId);
    coreOps.setTurnPlayer(firstPlayerId);
    logger.info(`${firstPlayerId} was chosen to go first`);
    return G;
};
export const mulligan = ({ G, ctx, playerID, coreOps }, cardsToMulligan) => {
    if (!playerID) {
        logger.warn("mulligan: No player ID provided");
        return createInvalidMove("NO_PLAYER_ID", "moves.mulligan.errors.noPlayerId");
    }
    // Validate mulligan selection (max 2 cards)
    if (cardsToMulligan.length > 2) {
        logger.warn("mulligan: Cannot mulligan more than 2 cards");
        return createInvalidMove("TOO_MANY_CARDS", "moves.mulligan.errors.tooManyCards", { cardCount: cardsToMulligan.length, maxCards: 2 });
    }
    const handZone = coreOps.getZone("hand", playerID);
    // Validate that all cards are in hand
    for (const cardId of cardsToMulligan) {
        if (!handZone.cards.includes(cardId)) {
            logger.warn(`mulligan: Card ${cardId} is not in hand`);
            return createInvalidMove("CARD_NOT_IN_HAND", "moves.mulligan.errors.cardNotInHand", { cardId, playerId: playerID });
        }
    }
    // Move cards to deck bottom through coreOps operations
    for (const cardId of cardsToMulligan) {
        coreOps.moveCard({
            playerId: playerID,
            instanceId: cardId,
            from: "hand",
            to: "deck",
            destination: "end",
        });
    }
    // Draw replacement cards
    const drawCount = cardsToMulligan.length;
    for (let i = 0; i < drawCount; i++) {
        coreOps.moveCard({
            playerId: playerID,
            from: "deck",
            to: "hand",
            destination: "end",
        });
    }
    // Remove from pending mulligan
    coreOps.playerHasMulliganed(playerID);
    logger.info(`Player ${playerID} mulliganed ${cardsToMulligan.length} cards`);
    return G;
};
/**
 * Resource management moves
 */
export const channelRunes = ({ G, ctx, playerID, coreOps }, count) => {
    if (!playerID) {
        logger.warn("channelRunes: No player ID provided");
        return createInvalidMove("NO_PLAYER_ID", "moves.channelRunes.errors.noPlayerId");
    }
    const currentPlayer = getCurrentTurnPlayer(ctx);
    if (currentPlayer !== playerID) {
        logger.warn(`channelRunes: Player ${playerID} is not the current turn player`);
        return createInvalidMove("NOT_TURN_PLAYER", "moves.channelRunes.errors.notTurnPlayer", { playerId: playerID, currentPlayer });
    }
    // Validate count
    if (count < 1 || count > 3) {
        logger.warn("channelRunes: Can only channel 1-3 runes per turn");
        return createInvalidMove("INVALID_RUNE_COUNT", "moves.channelRunes.errors.invalidRuneCount", { count, minRunes: 1, maxRunes: 3 });
    }
    // TODO: Implement rune channeling logic with coreOps operations
    // This would involve manipulating the player's resource state
    logger.info(`Player ${playerID} channeled ${count} runes`);
    return G;
};
/**
 * Card play moves
 */
export const playCard = ({ G, ctx, playerID, coreOps }, cardInstanceId, targetInstanceId) => {
    return createInvalidMove("NOT_IMPLEMENTED", "moves.playCard.errors.notImplemented", { cardInstanceId, targetInstanceId });
};
/**
 * Combat moves
 */
export const declareCombat = ({ G, ctx, playerID, coreOps }, attackers) => {
    if (!playerID) {
        logger.warn("declareCombat: No player ID provided");
        return createInvalidMove("NO_PLAYER_ID", "moves.declareCombat.errors.noPlayerId");
    }
    const currentTurnPlayer = getCurrentTurnPlayer(ctx);
    if (currentTurnPlayer !== playerID) {
        logger.warn(`declareCombat: Player ${playerID} is not the current turn player`);
        return createInvalidMove("NOT_TURN_PLAYER", "moves.declareCombat.errors.notTurnPlayer", { playerId: playerID, currentTurnPlayer });
    }
    // TODO: Validate attackers and implement combat logic
    logger.info(`Player ${playerID} declared combat with ${attackers.length} attackers`);
    return G;
};
/**
 * Utility moves
 */
export const drawCard = ({ G, ctx, playerID, coreOps }, params) => {
    if (!playerID) {
        logger.warn("drawCard: No player ID provided");
        return createInvalidMove("NO_PLAYER_ID", "moves.drawCard.errors.noPlayerId");
    }
    const count = params?.count || 1;
    const deckZone = coreOps.getZone("deck", playerID);
    if (deckZone.cards.length < count) {
        logger.warn(`drawCard: Player ${playerID} doesn't have enough cards to draw ${count}`);
        return createInvalidMove("INSUFFICIENT_CARDS", "moves.drawCard.errors.insufficientCards", {
            playerId: playerID,
            requestedCount: count,
            availableCards: deckZone.cards.length,
        });
    }
    for (let i = 0; i < count; i++) {
        coreOps.moveCard({
            playerId: playerID,
            from: "deck",
            to: "hand",
            destination: "end",
        });
    }
    logger.info(`Player ${playerID} drew ${count} card${count > 1 ? "s" : ""}`);
    return G;
};
export const discardCard = ({ G, ctx, playerID, coreOps }, cardInstanceId) => {
    if (!playerID) {
        logger.warn("discardCard: No player ID provided");
        return createInvalidMove("NO_PLAYER_ID", "moves.discardCard.errors.noPlayerId");
    }
    const handZone = coreOps.getZone("hand", playerID);
    if (!handZone.cards.includes(cardInstanceId)) {
        logger.warn("discardCard: Card not in player's hand");
        return createInvalidMove("CARD_NOT_IN_HAND", "moves.discardCard.errors.cardNotInHand", { cardInstanceId, playerId: playerID });
    }
    coreOps.moveCard({
        playerId: playerID,
        instanceId: cardInstanceId,
        from: "hand",
        to: "graveyard",
        destination: "end",
    });
    logger.info(`Player ${playerID} discarded a card`);
    return G;
};
export const endTurn = ({ G, ctx, playerID, coreOps }) => {
    if (!playerID) {
        logger.warn("endTurn: No player ID provided");
        return createInvalidMove("NO_PLAYER_ID", "moves.endTurn.errors.noPlayerId");
    }
    const currentTurnPlayer = getCurrentTurnPlayer(ctx);
    if (currentTurnPlayer !== playerID) {
        logger.warn(`endTurn: Player ${playerID} is not the current turn player`);
        return createInvalidMove("NOT_TURN_PLAYER", "moves.endTurn.errors.notTurnPlayer", { playerId: playerID, currentTurnPlayer });
    }
    // Pass to next player through coreOps operations
    const nextPlayerIndex = (ctx.turnPlayerPos + 1) % ctx.playerOrder.length;
    const nextPlayer = ctx.playerOrder[nextPlayerIndex];
    coreOps.setTurnPlayer(nextPlayer);
    coreOps.setPriorityPlayer(nextPlayer);
    logger.info(`Player ${playerID} ended their turn`);
    return G;
};
export const passPriority = ({ G, ctx, playerID, coreOps }) => {
    if (!playerID) {
        logger.warn("passPriority: No player ID provided");
        return createInvalidMove("NO_PLAYER_ID", "moves.passPriority.errors.noPlayerId");
    }
    const currentPriorityPlayer = getCurrentPriorityPlayer(ctx);
    if (currentPriorityPlayer !== playerID) {
        logger.warn(`passPriority: Player ${playerID} does not have priority`);
        return createInvalidMove("NO_PRIORITY", "moves.passPriority.errors.noPriority", { playerId: playerID, currentPriorityPlayer });
    }
    // Pass priority to next player
    const nextPlayerIndex = (ctx.priorityPlayerPos + 1) % ctx.playerOrder.length;
    const nextPlayer = ctx.playerOrder[nextPlayerIndex];
    coreOps.setPriorityPlayer(nextPlayer);
    logger.info(`Player ${playerID} passed priority`);
    return G;
};
export const concede = ({ G, ctx, playerID, coreOps }) => {
    if (!playerID) {
        logger.warn("concede: No player ID provided");
        return createInvalidMove("NO_PLAYER_ID", "moves.concede.errors.noPlayerId");
    }
    coreOps.concede(playerID);
    logger.info(`Player ${playerID} conceded the game`);
    return G;
};
/**
 * Export all moves
 */
export const riftboundMoves = {
    // Setup moves
    chooseDomainIdentity,
    chooseFirstPlayer,
    mulligan,
    // Resource moves
    channelRunes,
    // Card play moves
    playCard,
    // Combat moves
    declareCombat,
    // Utility moves
    drawCard,
    discardCard,
    endTurn,
    passPriority,
    concede,
};
//# sourceMappingURL=moves.js.map