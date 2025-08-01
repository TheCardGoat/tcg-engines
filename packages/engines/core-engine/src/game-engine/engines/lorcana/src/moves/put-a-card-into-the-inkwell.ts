import { createInvalidMove } from "~/game-engine/core-engine/move/move-types";
import { logger } from "~/game-engine/core-engine/utils/logger";
import type { LorcanaMove } from "./types";
import { toLorcanaCoreOps } from "./types";

// **4.3.3. **   Put a card into the inkwell. This turn action is limited to once per turn.
// **4.3.3.1. ** The player declares they're putting a card into their inkwell, then chooses and reveals a card from their hand with the inkwell symbol. All players verify that the inkwell symbol is present.
// **4.3.3.2. ** The player places the revealed card in their inkwell facedown and ready.
// **4.3.3.3. ** Effects that would occur as a result of a card being put into the inkwell are added to the bag \(see 8.7, "Bag"\).

// TODO: Somehow prevent the player from putting a card into the inkwell when they should be resolving a layer
export const putACardIntoTheInkwellMove: LorcanaMove = (
  { G, coreOps, playerID },
  instanceId: string,
) => {
  try {
    const lorcanaOps = toLorcanaCoreOps(coreOps);
    // Use getCtx instead of directly accessing ctx
    const ctx = lorcanaOps.getCtx();

    // Ensure we're in the main phase (this is a turn action)
    if (ctx.currentPhase !== "mainPhase") {
      logger.error(
        `Cannot put card into inkwell during ${ctx.currentPhase} phase`,
      );
      return createInvalidMove(
        "WRONG_PHASE",
        "moves.putCardIntoInkwell.errors.wrongPhase",
        { currentPhase: ctx.currentPhase, expectedPhase: "mainPhase" },
      );
    }

    const cardInstance = lorcanaOps.getCardInstance(instanceId);
    if (!cardInstance) {
      logger.error(
        `Failed to get card instance ${instanceId} or engine not available`,
      );

      return createInvalidMove(
        "CARD_NOT_FOUND",
        "moves.putCardIntoInkwell.errors.cardNotFound",
        { instanceId },
      );
    }

    const lorcanaCard = cardInstance;
    if (!lorcanaCard.inkwell) {
      logger.error(`Card ${instanceId} does not have an inkwell symbol`);
      return createInvalidMove(
        "NO_INKWELL_SYMBOL",
        "moves.putCardIntoInkwell.errors.noInkwellSymbol",
        { instanceId, cardName: lorcanaCard.card.name },
      );
    }

    // Check if player has already put a card in the inkwell this turn
    if (G.turnActions?.putCardIntoInkwell) {
      logger.error(
        `Player ${playerID} already put a card in the inkwell this turn`,
      );
      return createInvalidMove(
        "ACTION_ALREADY_USED",
        "moves.putCardIntoInkwell.errors.actionAlreadyUsed",
        { playerId: playerID },
      );
    }

    // Verify the card is in the player's hand
    const cardZone = lorcanaOps.getCardZone(instanceId);
    const cardOwner = lorcanaOps.getCardOwner(instanceId);

    if (cardZone !== "hand" || cardOwner !== playerID) {
      logger.error(
        `Card ${instanceId} is not in ${playerID}'s hand (zone: ${cardZone}, owner: ${cardOwner})`,
      );
      return createInvalidMove(
        "CARD_NOT_IN_HAND",
        "moves.putCardIntoInkwell.errors.cardNotInHand",
        { instanceId, playerId: playerID, cardZone, cardOwner },
      );
    }

    // Move card from hand to inkwell zone with validation
    logger.info(`Moving card ${instanceId} to ${playerID}'s inkwell`);
    const moveResult = lorcanaOps.moveCard({
      playerId: playerID,
      instanceId,
      to: "inkwell",
      from: "hand", // Ensure card comes from hand
    });

    if (moveResult) {
      // Convert zone operation error to invalid move
      logger.error(`Failed to move card to inkwell: ${moveResult.reason}`);
      return createInvalidMove(
        moveResult.reason,
        "moves.putCardIntoInkwell.errors.cardNotInHand",
        moveResult.context,
      );
    }

    try {
      // Mark that the player has used this action for the turn
      G.turnActions = {
        ...G.turnActions,
        putCardIntoInkwell: true,
      };

      // Add triggered effects to the bag for card in inkwell event
      lorcanaOps.addTriggeredEffectsToTheBag("onPutIntoInkwell", instanceId);

      logger.info(`Player ${playerID} put card ${instanceId} into the inkwell`);
    } catch (error) {
      logger.error(`Error handling inkwell effects: ${error}`);
      return createInvalidMove(
        "CARD_MOVE_ERROR",
        "moves.putCardIntoInkwell.errors.cardMoveError",
        { error: String(error), instanceId, playerId: playerID },
      );
    }
  } catch (error) {
    logger.error(`Unexpected error in putACardIntoTheInkwellMove: ${error}`);
    return createInvalidMove(
      "UNEXPECTED_ERROR",
      "moves.putCardIntoInkwell.errors.unexpectedError",
      { error: String(error), instanceId, playerId: playerID },
    );
  }

  // Effects that occur as a result of a card being put into the inkwell
  // have been added to the "bag" according to rule 8.7 via gameOps.addTriggeredEffectsToTheBag()

  return G;
};
