import { createInvalidMove } from "~/game-engine/core-engine/move/move-types";
import { logger } from "~/game-engine/core-engine/utils/logger";
import type { LorcanaMove } from "./types";
import { toLorcanaCoreOps } from "./types";

export const quest: LorcanaMove = (
  { G, coreOps, playerID },
  characterInstanceId: string,
) => {
  try {
    const lorcanaOps = toLorcanaCoreOps(coreOps);
    // Get ctx first, before using it
    const ctx = lorcanaOps.getCtx();

    // Ensure we're in the main phase (this is a turn action)
    if (ctx.currentPhase !== "mainPhase") {
      logger.error(`Cannot quest during ${ctx.currentPhase} phase`);
      return createInvalidMove("WRONG_PHASE", "moves.quest.errors.wrongPhase", {
        currentPhase: ctx.currentPhase,
        expectedPhase: "mainPhase",
      });
    }

    const characterInstance = lorcanaOps.getCardInstance(characterInstanceId);
    if (!characterInstance) {
      logger.error(`Failed to get character instance ${characterInstanceId}`);
      return createInvalidMove(
        "CHARACTER_NOT_FOUND",
        "moves.quest.errors.characterNotFound",
        { instanceId: characterInstanceId },
      );
    }

    const character = characterInstance;

    // Verify character is actually a character
    if (!character.card.type?.toLowerCase().includes("character")) {
      logger.error(`Card ${characterInstanceId} is not a character`);
      return createInvalidMove(
        "NOT_A_CHARACTER",
        "moves.quest.errors.notACharacter",
        { instanceId: characterInstanceId, cardType: character.card.type },
      );
    }

    // Verify character is in play
    const playCards = lorcanaOps.getCardsInZone("play", playerID);
    if (!playCards.find((card) => card.instanceId === characterInstanceId)) {
      logger.error(`Character ${characterInstanceId} is not in play`);
      return createInvalidMove(
        "CHARACTER_NOT_IN_PLAY",
        "moves.quest.errors.characterNotInPlay",
        { instanceId: characterInstanceId, playerId: playerID },
      );
    }

    // Validate character is owned by the player
    const characterOwner = lorcanaOps.getCardOwner(characterInstanceId);
    if (characterOwner !== playerID) {
      logger.error(
        `Character ${characterInstanceId} is not owned by player ${playerID}`,
      );
      return createInvalidMove(
        "CHARACTER_NOT_CONTROLLED",
        "moves.quest.errors.characterNotControlled",
        { instanceId: characterInstanceId, playerId: playerID },
      );
    }

    // Check if character can quest (not exerted)
    if (!lorcanaOps.canCharacterQuest(characterInstanceId)) {
      logger.error(`Character ${characterInstanceId} cannot quest`);
      return createInvalidMove(
        "CANNOT_QUEST",
        "moves.quest.errors.cannotQuest",
        { instanceId: characterInstanceId, playerId: playerID },
      );
    }

    // Quest with character - this will:
    // 1. Exert the character
    // 2. Add lore based on character's lore value
    // 3. Add triggered effects to the bag
    lorcanaOps.questWithCharacter(characterInstanceId);

    logger.info(
      `Player ${playerID} quested with character ${characterInstanceId}`,
    );

    return G;
  } catch (error) {
    logger.error(`Unexpected error in questMove: ${error}`);
    return createInvalidMove(
      "UNEXPECTED_ERROR",
      "moves.quest.errors.unexpectedError",
      {
        error: String(error),
        characterInstanceId,
        playerId: playerID,
      },
    );
  }
};
