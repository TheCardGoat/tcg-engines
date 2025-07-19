import { createInvalidMove } from "~/game-engine/core-engine/move/move-types";
import { logger } from "~/game-engine/core-engine/utils/logger";
import type { LorcanaCardInstance } from "../cards/lorcana-card-instance";
import type { LorcanaMove } from "./types";

// **4.3.8. Use activated abilities on cards in play**
// - {E} abilities only if character is dry (not exerted)
// - Activated abilities of items can be used the turn played
// - Follow steps in section 7.5 "Activated Abilities"

interface ActivatedAbilityOptions {
  abilityId: string; // Identifier for which ability to activate
  targets?: string[]; // Target instance IDs if the ability requires targets
}

export const useActivatedAbilityMove: LorcanaMove = (
  { G, ctx, coreOps, playerID },
  sourceInstanceId: string,
  options: ActivatedAbilityOptions,
) => {
  try {
    // Ensure we're in the main phase (this is a turn action)
    if (ctx.currentPhase !== "mainPhase") {
      logger.error(
        `Cannot use activated ability during ${ctx.currentPhase} phase`,
      );
      return createInvalidMove(
        "WRONG_PHASE",
        "moves.useActivatedAbility.errors.wrongPhase",
        { currentPhase: ctx.currentPhase, expectedPhase: "mainPhase" },
      );
    }

    const sourceInstance = coreOps.getCardInstance(sourceInstanceId);
    if (!sourceInstance) {
      logger.error(`Failed to get source instance ${sourceInstanceId}`);
      return createInvalidMove(
        "SOURCE_NOT_FOUND",
        "moves.useActivatedAbility.errors.sourceNotFound",
        { instanceId: sourceInstanceId },
      );
    }

    const sourceCard = sourceInstance;

    // Verify source is controlled by the player
    const sourceOwner = coreOps.getCardOwner(sourceInstanceId);
    if (sourceOwner !== playerID) {
      logger.error(
        `Source ${sourceInstanceId} is not controlled by player ${playerID}`,
      );
      return createInvalidMove(
        "SOURCE_NOT_CONTROLLED",
        "moves.useActivatedAbility.errors.sourceNotControlled",
        { instanceId: sourceInstanceId, playerId: playerID },
      );
    }

    // Verify source is in play
    const playCards = coreOps.getCardsInZone("play", playerID);
    if (!playCards.find((card) => card.instanceId === sourceInstanceId)) {
      logger.error(`Source ${sourceInstanceId} is not in play`);
      return createInvalidMove(
        "SOURCE_NOT_IN_PLAY",
        "moves.useActivatedAbility.errors.sourceNotInPlay",
        { instanceId: sourceInstanceId, playerId: playerID },
      );
    }

    // Get the card's abilities
    const cardAbilities = (sourceCard.card as any).abilities || [];

    // Find the specific ability to activate
    const abilityToActivate = cardAbilities.find(
      (ability: any) =>
        ability.id === options.abilityId || ability.type === "activated",
    );

    if (!abilityToActivate) {
      logger.error(
        `Activated ability ${options.abilityId} not found on card ${sourceInstanceId}`,
      );
      return createInvalidMove(
        "ABILITY_NOT_FOUND",
        "moves.useActivatedAbility.errors.abilityNotFound",
        { instanceId: sourceInstanceId, abilityId: options.abilityId },
      );
    }

    // Check if ability is actually activated type
    if (abilityToActivate.type !== "activated") {
      logger.error(`Ability ${options.abilityId} is not an activated ability`);
      return createInvalidMove(
        "NOT_ACTIVATED_ABILITY",
        "moves.useActivatedAbility.errors.notActivatedAbility",
        { instanceId: sourceInstanceId, abilityId: options.abilityId },
      );
    }

    // Check specific restrictions for character abilities
    const isCharacter = sourceCard.card.type?.includes("Character");
    if (isCharacter) {
      // Characters must be ready (not exerted) to use {E} abilities
      const hasExertCost = abilityToActivate.cost?.exert === true;
      if (hasExertCost) {
        // Note: This would need proper character state tracking for exerted status
        // For now, we assume characters are ready unless explicitly marked as exerted
        logger.info(`Character ${sourceInstanceId} using exert ability`);
      }
    }

    // Check if ability has usage restrictions (e.g., once per turn)
    // Note: This would need proper usage tracking

    // Validate targets if required
    if (abilityToActivate.targets && abilityToActivate.targets.length > 0) {
      if (!options.targets || options.targets.length === 0) {
        logger.error(
          `Ability ${options.abilityId} requires targets but none provided`,
        );
        return createInvalidMove(
          "TARGETS_REQUIRED",
          "moves.useActivatedAbility.errors.targetsRequired",
          { instanceId: sourceInstanceId, abilityId: options.abilityId },
        );
      }

      // Validate each target
      for (const targetId of options.targets) {
        const targetInstance = coreOps.getCardInstance(targetId);
        if (!targetInstance) {
          logger.error(`Target ${targetId} not found`);
          return createInvalidMove(
            "TARGET_NOT_FOUND",
            "moves.useActivatedAbility.errors.targetNotFound",
            { instanceId: sourceInstanceId, targetId },
          );
        }
      }
    }

    // Pay the ability's cost
    const abilityCost = abilityToActivate.cost || {};

    // Pay ink cost if required
    if (abilityCost.ink && abilityCost.ink > 0) {
      const inkCards = coreOps.getCardsInZone("inkwell", playerID);
      if (inkCards.length < abilityCost.ink) {
        logger.error(
          `Player ${playerID} does not have enough ink to activate ability. Required: ${abilityCost.ink}, Available: ${inkCards.length}`,
        );
        return createInvalidMove(
          "INSUFFICIENT_INK",
          "moves.useActivatedAbility.errors.insufficientInk",
          {
            required: abilityCost.ink,
            available: inkCards.length,
            playerId: playerID,
          },
        );
      }
      logger.info(
        `Player ${playerID} pays ${abilityCost.ink} ink for activated ability`,
      );
    }

    // Exert the source if required
    if (abilityCost.exert) {
      logger.info(`Exerting ${sourceInstanceId} to activate ability`);
      // Note: This would need proper character state management
    }

    // Handle other costs (banish, discard, damage, etc.)
    if (abilityCost.banish) {
      logger.info(`Banishing ${sourceInstanceId} to activate ability`);
      // Would need to move card to discard pile
    }

    // Apply the ability's effect
    logger.info(
      `Applying effect of ability ${options.abilityId} from ${sourceInstanceId}`,
    );

    // Add the ability to the stack/bag for resolution
    // Note: Would need proper ability resolution system

    logger.info(
      `Player ${playerID} activated ability ${options.abilityId} on ${sourceInstanceId}`,
    );

    return G;
  } catch (error) {
    logger.error(`Unexpected error in useActivatedAbilityMove: ${error}`);
    return createInvalidMove(
      "UNEXPECTED_ERROR",
      "moves.useActivatedAbility.errors.unexpectedError",
      {
        error: String(error),
        sourceInstanceId,
        abilityId: options?.abilityId,
        playerId: playerID,
      },
    );
  }
};
