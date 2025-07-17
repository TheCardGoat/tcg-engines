import { createInvalidMove } from "~/game-engine/core-engine/move/move-types";
import { logger } from "~/game-engine/core-engine/utils/logger";
import type { LorcanaCardInstance } from "../cards/lorcana-card-instance";
import type { LorcanaMove } from "./types";

// **4.3.7. **Move a character to a location.

// **4.3.7.1. **A player can move only their characters. A player can move characters only to their locations. A player can't move opposing characters, and they can't move their characters to opposing locations.
// **4.3.7.2. **Moving a character to a location is a turn action. To move a character to a location, the active player follows the steps listed here in order.
// **4.3.7.3. **First, the player chooses one of their characters and one of their locations and declares that the character will move to that location.
// **4.3.7.4. **Second, the player pays the chosen location's move cost. Once the cost is paid, the character moves to the location.
// **4.3.7.5. **Third, any effects that would happen as a result of the character moving are added to the bag for resolution.
// **4.3.7.6. **Once all effects have been resolved, the move is complete.

export const moveCharacterToLocationMove: LorcanaMove = (
  { G, ctx, coreOps, gameOps, playerID },
  locationInstanceId: string, // Fixed parameter order to match engine call
  characterInstanceId: string,
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

    const characterInstance: LorcanaCardInstance =
      coreOps.getCardInstance(characterInstanceId);
    if (!characterInstance) {
      logger.error(`Failed to get character instance ${characterInstanceId}`);
      return createInvalidMove(
        "CHARACTER_NOT_FOUND",
        "moves.moveCharacterToLocation.errors.characterNotFound",
        { instanceId: characterInstanceId },
      );
    }

    const locationInstance: LorcanaCardInstance =
      coreOps.getCardInstance(locationInstanceId);
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
    const characterOwner = coreOps.getCardOwner(characterInstanceId);
    const locationOwner = coreOps.getCardOwner(locationInstanceId);

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
    if (!playCards.find((card) => card.instanceId === locationInstanceId)) {
      logger.error(`Location ${locationInstanceId} is not in play`);
      return createInvalidMove(
        "LOCATION_NOT_IN_PLAY",
        "moves.moveCharacterToLocation.errors.locationNotInPlay",
        { instanceId: locationInstanceId, playerId: playerID },
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

    // Pay the move cost by marking ink cards as exerted
    // Note: In full implementation, should track exerted vs ready ink cards
    // For now, we simulate payment by marking ink as exerted
    for (let i = 0; i < moveCost; i++) {
      const inkCard = inkCards[i];
      if (inkCard) {
        // Mark ink card as exerted in game state metadata
        if (!G.metas[inkCard.instanceId]) {
          G.metas[inkCard.instanceId] = {};
        }
        G.metas[inkCard.instanceId].exerted = true;
      }
    }

    logger.info(`Player ${playerID} pays ${moveCost} ink to move character`);

    // Track character-location relationship by setting character's location metadata
    if (!G.metas[characterInstanceId]) {
      G.metas[characterInstanceId] = {};
    }
    G.metas[characterInstanceId].location = locationInstanceId;

    // Track characters at location by adding to location's characters array
    if (!G.metas[locationInstanceId]) {
      G.metas[locationInstanceId] = {};
    }
    const currentCharactersAtLocation =
      G.metas[locationInstanceId].characters || [];
    if (!currentCharactersAtLocation.includes(characterInstanceId)) {
      G.metas[locationInstanceId].characters = [
        ...currentCharactersAtLocation,
        characterInstanceId,
      ];
    }

    logger.info(
      `Character ${characterInstanceId} moves to location ${locationInstanceId}`,
    );

    // Add triggered effects to the bag (rule 4.3.7.5)
    gameOps?.addTriggeredEffectsToTheBag("onMove", characterInstanceId);

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
};
