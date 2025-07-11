import { createInvalidMove } from "~/game-engine/core-engine/move/move-types";
import { logger } from "~/game-engine/core-engine/utils/logger";
import type { LorcanaCardInstance } from "../cards/lorcana-card-instance";
import type { LorcanaMove } from "./types";

// **4.3.7. Move a character to a location**
// Player chooses one of their characters and locations, pays the location's move cost,
// character moves to the location, and effects from moving are added to the bag.

interface MoveToLocationOptions {
  locationInstanceId: string; // The location to move the character to
}

export const moveCharacterToLocationMove: LorcanaMove = (
  { G, ctx, coreOps, gameOps, playerID },
  characterInstanceId: string,
  options: MoveToLocationOptions,
) => {
  try {
    // Ensure we're in the main phase (this is a turn action)
    if (ctx.currentPhase !== "mainPhase") {
      logger.error(`Cannot move character during ${ctx.currentPhase} phase`);
      return createInvalidMove(
        "WRONG_PHASE",
        "moves.moveCharacterToLocation.errors.wrongPhase",
        { currentPhase: ctx.currentPhase, expectedPhase: "mainPhase" },
      );
    }

    const characterInstance = coreOps.getCardInstance(characterInstanceId);
    if (!characterInstance) {
      logger.error(`Failed to get character instance ${characterInstanceId}`);
      return createInvalidMove(
        "CHARACTER_NOT_FOUND",
        "moves.moveCharacterToLocation.errors.characterNotFound",
        { instanceId: characterInstanceId },
      );
    }

    const locationInstance = coreOps.getCardInstance(
      options.locationInstanceId,
    );
    if (!locationInstance) {
      logger.error(
        `Failed to get location instance ${options.locationInstanceId}`,
      );
      return createInvalidMove(
        "LOCATION_NOT_FOUND",
        "moves.moveCharacterToLocation.errors.locationNotFound",
        { instanceId: options.locationInstanceId },
      );
    }

    const character = characterInstance as LorcanaCardInstance;
    const location = locationInstance as LorcanaCardInstance;

    // Verify character is actually a character
    if (!character.card.type?.includes("Character")) {
      logger.error(`Card ${characterInstanceId} is not a character`);
      return createInvalidMove(
        "NOT_A_CHARACTER",
        "moves.moveCharacterToLocation.errors.notACharacter",
        { instanceId: characterInstanceId, cardType: character.card.type },
      );
    }

    // Verify location is actually a location
    if (!location.card.type?.includes("Location")) {
      logger.error(`Card ${options.locationInstanceId} is not a location`);
      return createInvalidMove(
        "NOT_A_LOCATION",
        "moves.moveCharacterToLocation.errors.notALocation",
        {
          instanceId: options.locationInstanceId,
          cardType: location.card.type,
        },
      );
    }

    // Verify both character and location are controlled by the player
    const characterOwner = coreOps.getCardOwner(characterInstanceId);
    const locationOwner = coreOps.getCardOwner(options.locationInstanceId);

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
        `Location ${options.locationInstanceId} is not controlled by player ${playerID}`,
      );
      return createInvalidMove(
        "LOCATION_NOT_CONTROLLED",
        "moves.moveCharacterToLocation.errors.locationNotControlled",
        { instanceId: options.locationInstanceId, playerId: playerID },
      );
    }

    // Verify character is in play
    const playCards = coreOps.getCardsInZone("play", playerID);
    if (!playCards.find((card) => card.instanceId === characterInstanceId)) {
      logger.error(`Character ${characterInstanceId} is not in play`);
      return createInvalidMove(
        "CHARACTER_NOT_IN_PLAY",
        "moves.moveCharacterToLocation.errors.characterNotInPlay",
        { instanceId: characterInstanceId, playerId: playerID },
      );
    }

    // Verify location is in play
    if (
      !playCards.find((card) => card.instanceId === options.locationInstanceId)
    ) {
      logger.error(`Location ${options.locationInstanceId} is not in play`);
      return createInvalidMove(
        "LOCATION_NOT_IN_PLAY",
        "moves.moveCharacterToLocation.errors.locationNotInPlay",
        { instanceId: options.locationInstanceId, playerId: playerID },
      );
    }

    // Get the move cost of the location
    const moveCost = (location.card as any).moveCost || 0;

    // Check if player has enough ink to pay the move cost
    const inkCards = coreOps.getCardsInZone("inkwell", playerID);
    if (inkCards.length < moveCost) {
      logger.error(
        `Player ${playerID} does not have enough ink to move character. Required: ${moveCost}, Available: ${inkCards.length}`,
      );
      return createInvalidMove(
        "INSUFFICIENT_INK",
        "moves.moveCharacterToLocation.errors.insufficientInk",
        {
          required: moveCost,
          available: inkCards.length,
          playerId: playerID,
        },
      );
    }

    // Pay the move cost (would need proper ink exerting system)
    logger.info(`Player ${playerID} pays ${moveCost} ink to move character`);

    // Move the character to the location (this would need proper location tracking)
    logger.info(
      `Character ${characterInstanceId} moves to location ${options.locationInstanceId}`,
    );

    // Add triggered effects to the bag
    gameOps?.addTriggeredEffectsToTheBag("onMove", characterInstanceId);

    logger.info(
      `Player ${playerID} moved character ${characterInstanceId} to location ${options.locationInstanceId} for ${moveCost} ink`,
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
        locationInstanceId: options?.locationInstanceId,
        playerId: playerID,
      },
    );
  }
};
