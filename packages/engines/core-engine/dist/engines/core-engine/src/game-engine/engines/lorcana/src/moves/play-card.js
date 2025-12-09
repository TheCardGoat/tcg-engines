import { createInvalidMove } from "~/game-engine/core-engine/move/move-types";
import { logger } from "~/game-engine/core-engine/utils/logger";
export const playCardMove = ({ G, ctx, coreOps, gameOps, playerID }, instanceId, options) => {
    try {
        // Ensure we're in the main phase (this is a turn action)
        if (ctx.currentPhase !== "mainPhase") {
            logger.error(`Cannot play card during ${ctx.currentPhase} phase`);
            return createInvalidMove("WRONG_PHASE", "moves.playCard.errors.wrongPhase", { currentPhase: ctx.currentPhase, expectedPhase: "mainPhase" });
        }
        const cardInstance = coreOps.getCardInstance(instanceId);
        if (!cardInstance) {
            logger.error(`Failed to get card instance ${instanceId} or engine not available`);
            return createInvalidMove("CARD_NOT_FOUND", "moves.playCard.errors.cardNotFound", { instanceId });
        }
        // Type assertion is safe here because LorcanaEngine.initializeCardModels() ensures
        // all card instances are replaced with LorcanaCardInstance objects during engine initialization
        const lorcanaCard = cardInstance;
        // Verify card is in player's hand
        const handCards = coreOps.getCardsInZone("hand", playerID);
        if (!handCards.find((card) => card.instanceId === instanceId)) {
            logger.error(`Card ${instanceId} is not in player ${playerID}'s hand`);
            return createInvalidMove("CARD_NOT_IN_HAND", "moves.playCard.errors.cardNotInHand", { instanceId, playerId: playerID });
        }
        // Determine the cost to play the card
        let totalCost = lorcanaCard.card.cost;
        let targetZone = "play";
        // Handle alternative costs (like Shift)
        if (options?.alternativeCost) {
            if (options.alternativeCost.type === "shift") {
                // For shift, verify the target character exists and is valid
                const shiftTarget = coreOps.getCardInstance(options.alternativeCost.targetInstanceId);
                if (!shiftTarget) {
                    return createInvalidMove("SHIFT_TARGET_NOT_FOUND", "moves.playCard.errors.shiftTargetNotFound", { targetInstanceId: options.alternativeCost.targetInstanceId });
                }
                const lorcanaShiftTarget = shiftTarget;
                // Verify shift target has the same name
                if (lorcanaCard.card.name !== lorcanaShiftTarget.card.name) {
                    return createInvalidMove("INVALID_SHIFT_TARGET", "moves.playCard.errors.invalidShiftTarget", {
                        cardName: lorcanaCard.card.name,
                        targetName: lorcanaShiftTarget.card.name,
                    });
                }
                // Calculate shift cost (typically cost - shift value)
                // Note: shiftCost would need to be added to card definition or instance
                const shiftValue = lorcanaCard.card.shift || 0;
                const shiftCost = lorcanaCard.card.cost - shiftValue;
                totalCost = Math.max(0, shiftCost);
            }
        }
        // Check if player has enough ink to pay the cost
        const inkCards = coreOps.getCardsInZone("inkwell", playerID);
        // Note: We'll need to implement proper card state tracking for exerted status
        // For now, assume all inkwell cards are ready
        if (inkCards.length < totalCost) {
            logger.error(`Player ${playerID} does not have enough ink to play card. Required: ${totalCost}, Available: ${inkCards.length}`);
            return createInvalidMove("INSUFFICIENT_INK", "moves.playCard.errors.insufficientInk", {
                required: totalCost,
                available: inkCards.length,
                playerId: playerID,
            });
        }
        // Note: Exerting ink cards would need to be implemented through proper card state management
        // For now, we skip the exerting step as the CoreOperation doesn't have an exertCard method
        // This would need to be implemented in the game-specific operations
        // Determine target zone based on card type
        if (lorcanaCard.card.type.includes("Action")) {
            targetZone = "discard"; // Actions go to discard after resolving
        }
        // Handle Shift - if shifting, banish the target character first
        if (options?.alternativeCost?.type === "shift") {
            const banishResult = coreOps.moveCard({
                playerId: playerID,
                instanceId: options.alternativeCost.targetInstanceId,
                to: "discard",
                from: "play",
            });
            if (banishResult) {
                logger.error(`Failed to banish shift target: ${banishResult.reason}`);
                return createInvalidMove(banishResult.reason, "moves.playCard.errors.failedToBanishShiftTarget", banishResult.context);
            }
        }
        // Move card to appropriate zone
        const moveResult = coreOps.moveCard({
            playerId: playerID,
            instanceId,
            to: targetZone,
            from: "hand",
        });
        if (moveResult) {
            logger.error(`Failed to move card to ${targetZone}: ${moveResult.reason}`);
            return createInvalidMove(moveResult.reason, "moves.playCard.errors.cardMoveError", moveResult.context);
        }
        // Handle card-specific effects based on type
        if (lorcanaCard.card.type.includes("Character")) {
            // Characters enter play "wet" (cannot act immediately unless they have Rush)
            // This should be handled by the card instance state
        }
        // Add triggered effects to the bag (rule 4.3.4.6)
        gameOps?.addTriggeredEffectsToTheBag("onPlay", instanceId);
        // For actions, resolve their effects immediately
        if (lorcanaCard.card.type.includes("Action")) {
            // Action effects would be resolved here
            // This would need to be implemented based on the specific action
            // Note: Actions resolve immediately rather than adding triggered effects
        }
        logger.info(`Player ${playerID} played card ${instanceId} for ${totalCost} ink${options?.alternativeCost ? ` using ${options.alternativeCost.type}` : ""}`);
        return G;
    }
    catch (error) {
        logger.error(`Unexpected error in playCardMove: ${error}`);
        return createInvalidMove("UNEXPECTED_ERROR", "moves.playCard.errors.unexpectedError", { error: String(error), instanceId, playerId: playerID });
    }
};
//# sourceMappingURL=play-card.js.map