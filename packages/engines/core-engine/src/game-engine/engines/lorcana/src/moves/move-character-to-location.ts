import { createInvalidMove } from "~/game-engine/core-engine/move/move-types";
import { logger } from "~/game-engine/core-engine/utils/logger";
import type { LorcanaCardInstance } from "../cards/lorcana-card-instance";
import type { LorcanaMove } from "./types";
import { toLorcanaCoreOps } from "./types";

// **4.3.7. **Move a character to a location.

// **4.3.7.1. **A player can move only their characters. A player can move characters only to their locations. A player can't move opposing characters, and they can't move their characters to opposing locations.
// **4.3.7.2. **Moving a character to a location is a turn action. To move a character to a location, the active player follows the steps listed here in order.
// **4.3.7.3. **First, the player chooses one of their characters and one of their locations and declares that the character will move to that location.
// **4.3.7.4. **Second, the player pays the chosen location's move cost. Once the cost is paid, the character moves to the location.
// **4.3.7.5. **Third, any effects that would happen as a result of the character moving are added to the bag for resolution.
// **4.3.7.6. **Once all effects have been resolved, the move is complete.

export const moveCharacter: LorcanaMove = {
  execute: (
    { G, coreOps, playerID },
    locationInstanceId: string,
    characterInstanceId: string,
  ) => {
    try {
      // We know this will be LorcanaCoreOperations because we set it in LorcanaEngine constructor
      const lorcanaOps = toLorcanaCoreOps(coreOps);
      // Use getCtx instead of directly accessing ctx
      const ctx = lorcanaOps.getCtx();

      logger.info(
        `Player ${playerID} attempting to move character ${characterInstanceId} to location ${locationInstanceId}`,
      );

      // Ensure we're in the main phase (this is a turn action)
      if (ctx.currentPhase !== "mainPhase") {
        logger.error(`Cannot move character during ${ctx.currentPhase} phase`);
        return createInvalidMove(
          "WRONG_PHASE",
          "moves.moveCharacterToLocation.errors.wrongPhase",
          { currentPhase: ctx.currentPhase, expectedPhase: "mainPhase" },
        );
      }

      const characterInstance: LorcanaCardInstance =
        lorcanaOps.getCardInstance(characterInstanceId);
      if (!characterInstance) {
        logger.error(`Failed to get character instance ${characterInstanceId}`);
        return createInvalidMove(
          "CHARACTER_NOT_FOUND",
          "moves.moveCharacterToLocation.errors.characterNotFound",
          { instanceId: characterInstanceId },
        );
      }

      const locationInstance: LorcanaCardInstance =
        lorcanaOps.getCardInstance(locationInstanceId);
      if (!locationInstance) {
        logger.error(`Failed to get location instance ${locationInstanceId}`);
        return createInvalidMove(
          "LOCATION_NOT_FOUND",
          "moves.moveCharacterToLocation.errors.locationNotFound",
          { instanceId: locationInstanceId },
        );
      }

      const character = characterInstance;
      const location = locationInstance;

      // Verify character is actually a character
      if (!character.card.type?.toLowerCase().includes("character")) {
        logger.error(`Card ${characterInstanceId} is not a character`);
        return createInvalidMove(
          "NOT_A_CHARACTER",
          "moves.moveCharacterToLocation.errors.notACharacter",
          { instanceId: characterInstanceId, cardType: character.card.type },
        );
      }

      // Verify location is actually a location
      if (!location.card.type?.toLowerCase().includes("location")) {
        logger.error(`Card ${locationInstanceId} is not a location`);
        return createInvalidMove(
          "NOT_A_LOCATION",
          "moves.moveCharacterToLocation.errors.notALocation",
          {
            instanceId: locationInstanceId,
            cardType: location.card.type,
          },
        );
      }

      // Verify both character and location are controlled by the player
      const characterOwner = lorcanaOps.getCardOwner(characterInstanceId);
      const locationOwner = lorcanaOps.getCardOwner(locationInstanceId);

      if (characterOwner !== playerID) {
        logger.error(
          `Character ${characterInstanceId} is not controlled by player ${playerID}`,
        );
        return createInvalidMove(
          "CHARACTER_NOT_CONTROLLED",
          "moves.moveCharacterToLocation.errors.characterNotControlled",
          { instanceId: characterInstanceId, playerId: playerID },
        );
      }

      if (locationOwner !== playerID) {
        logger.error(
          `Location ${locationInstanceId} is not controlled by player ${playerID}`,
        );
        return createInvalidMove(
          "LOCATION_NOT_CONTROLLED",
          "moves.moveCharacterToLocation.errors.locationNotControlled",
          { instanceId: locationInstanceId, playerId: playerID },
        );
      }

      // Verify character is in play
      const playCards = lorcanaOps.getCardsInZone("play", playerID);
      if (!playCards.find((card) => card.instanceId === characterInstanceId)) {
        logger.error(`Character ${characterInstanceId} is not in play`);
        return createInvalidMove(
          "CHARACTER_NOT_IN_PLAY",
          "moves.moveCharacterToLocation.errors.characterNotInPlay",
          { instanceId: characterInstanceId, playerId: playerID },
        );
      }

      // Verify location is in play
      if (!playCards.find((card) => card.instanceId === locationInstanceId)) {
        logger.error(`Location ${locationInstanceId} is not in play`);
        return createInvalidMove(
          "LOCATION_NOT_IN_PLAY",
          "moves.moveCharacterToLocation.errors.locationNotInPlay",
          { instanceId: locationInstanceId, playerId: playerID },
        );
      }

      // Verify if character is already at the location
      if (character.isAtLocation(location)) {
        logger.error(
          `Character ${characterInstanceId} is already at location ${locationInstanceId}`,
        );
        return createInvalidMove(
          "ALREADY_AT_LOCATION",
          "moves.moveCharacterToLocation.errors.alreadyAtLocation",
          {
            characterInstanceId,
            locationInstanceId,
            playerId: playerID,
          },
        );
      }

      // Get the move cost of the location
      const moveCost = location.moveCost || 0;

      // Check if player has enough ink to pay the move cost using game operations
      const availableInk = lorcanaOps.getAvailableInk(playerID);
      if (availableInk < moveCost) {
        logger.warn(
          `Player ${playerID} does not have enough ink to move character. Required: ${moveCost}, Available: ${availableInk}`,
        );
        return createInvalidMove(
          "INSUFFICIENT_INK",
          "moves.moveCharacterToLocation.errors.insufficientInk",
          {
            required: moveCost,
            available: availableInk,
            playerId: playerID,
          },
        );
      }

      // Pay the move cost using game operations
      const paymentSuccessful = lorcanaOps.exertInkForCost(playerID, moveCost);
      if (!paymentSuccessful) {
        logger.warn(
          `Player ${playerID} failed to pay ${moveCost} ink for move`,
        );
        return createInvalidMove(
          "PAYMENT_FAILED",
          "moves.moveCharacterToLocation.errors.paymentFailed",
          {
            required: moveCost,
            playerId: playerID,
          },
        );
      }

      logger.info(`Player ${playerID} pays ${moveCost} ink to move character`);

      // Use LorcanaCoreOperations to enter location
      lorcanaOps.enterLocation(character, location);

      logger.info(
        `Player ${playerID} moved character ${characterInstanceId} to location ${locationInstanceId} for ${moveCost} ink`,
      );

      return G;
    } catch (error) {
      logger.error(`Unexpected error in moveCharacterToLocationMove: ${error}`);
      return createInvalidMove(
        "UNEXPECTED_ERROR",
        "moves.moveCharacterToLocation.errors.unexpectedError",
        {
          error: String(error),
          characterInstanceId,
          locationInstanceId,
          playerId: playerID,
        },
      );
    }
  },
};
