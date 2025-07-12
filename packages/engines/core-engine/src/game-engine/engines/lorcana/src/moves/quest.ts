import { createInvalidMove } from "~/game-engine/core-engine/move/move-types";
import { logger } from "~/game-engine/core-engine/utils/logger";
import type { LorcanaCardInstance } from "../cards/lorcana-card-instance";
import type { LorcanaMove } from "./types";

// **4.3.5. Quest**
// **4.3.5.1.** The player declares that a character they control is questing.
// **4.3.5.2.** Identify the questing character and check for restrictions. The character must be able to quest (must be ready and must not have any restrictions that would prevent it from questing).
// **4.3.5.3.** Exert the questing character.
// **4.3.5.4.** The player controlling the questing character gains lore equal to that character's {L} value.
// **4.3.5.5.** Effects that would occur as a result of this character questing are added to the bag.

export const questMove: LorcanaMove = (
  { G, ctx, coreOps, gameOps, playerID },
  instanceId: string,
) => {
  try {
    // Ensure we're in the main phase (this is a turn action)
    if (ctx.currentPhase !== "mainPhase") {
      logger.error(`Cannot quest during ${ctx.currentPhase} phase`);
      return createInvalidMove("WRONG_PHASE", "moves.quest.errors.wrongPhase", {
        currentPhase: ctx.currentPhase,
        expectedPhase: "mainPhase",
      });
    }

    const cardInstance = coreOps.getCardInstance(instanceId);
    if (!cardInstance) {
      logger.error(
        `Failed to get card instance ${instanceId} or engine not available`,
      );
      return createInvalidMove(
        "CARD_NOT_FOUND",
        "moves.quest.errors.cardNotFound",
        { instanceId },
      );
    }

    // Type assertion is safe here because LorcanaEngine.initializeCardModels() ensures
    // all card instances are replaced with LorcanaCardInstance objects during engine initialization
    const lorcanaCard = cardInstance as LorcanaCardInstance;

    // Verify card is a character
    if (!lorcanaCard.card.type?.includes("Character")) {
      logger.error(`Card ${instanceId} is not a character`);
      return createInvalidMove(
        "NOT_A_CHARACTER",
        "moves.quest.errors.notACharacter",
        { instanceId, cardType: lorcanaCard.card.type },
      );
    }

    // Verify card is in player's play zone
    const playCards = coreOps.getCardsInZone("play", playerID);
    if (!playCards.find((card) => card.instanceId === instanceId)) {
      logger.error(
        `Character ${instanceId} is not in player ${playerID}'s play zone`,
      );
      return createInvalidMove(
        "CHARACTER_NOT_IN_PLAY",
        "moves.quest.errors.characterNotInPlay",
        { instanceId, playerId: playerID },
      );
    }

    // Check if character is ready (not exerted)
    // Note: This would need proper character state tracking
    // For now, we assume characters can quest if they're in play

    // Check for quest restrictions
    // Characters with "Reckless" keyword cannot quest
    const cardKeywords = (lorcanaCard.card as any).keywords || [];
    if (cardKeywords.includes("Reckless")) {
      logger.error(`Character ${instanceId} has Reckless and cannot quest`);
      return createInvalidMove(
        "CHARACTER_RECKLESS",
        "moves.quest.errors.characterReckless",
        { instanceId, cardName: lorcanaCard.card.name },
      );
    }

    // Check if character is "wet" (played this turn and doesn't have Rush)
    // Note: This would need proper turn tracking and character state
    // For now, we skip this check

    // Get the lore value of the character
    const loreValue = (lorcanaCard.card as any).lore || 0;
    if (loreValue <= 0) {
      logger.error(
        `Character ${instanceId} has no lore value and cannot quest`,
      );
      return createInvalidMove(
        "NO_LORE_VALUE",
        "moves.quest.errors.noLoreValue",
        { instanceId, cardName: lorcanaCard.card.name },
      );
    }

    // Exert the character (would need proper character state management)
    // For now, we note that the character should be exerted
    logger.info(`Exerting character ${instanceId} for questing`);

    // Award lore to the player
    // Note: This would need proper player state management
    // For now, we just log the lore gain
    logger.info(
      `Player ${playerID} gains ${loreValue} lore from questing with ${lorcanaCard.card.name}`,
    );

    // Add triggered effects to the bag (rule 4.3.5.5)
    gameOps?.addTriggeredEffectsToTheBag("onQuest", instanceId);

    logger.info(
      `Player ${playerID} quested with character ${instanceId} (${lorcanaCard.card.name}) for ${loreValue} lore`,
    );

    return G;
  } catch (error) {
    logger.error(`Unexpected error in questMove: ${error}`);
    return createInvalidMove(
      "UNEXPECTED_ERROR",
      "moves.quest.errors.unexpectedError",
      { error: String(error), instanceId, playerId: playerID },
    );
  }
};
