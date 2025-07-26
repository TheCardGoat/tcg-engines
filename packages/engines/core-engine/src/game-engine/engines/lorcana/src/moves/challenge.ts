import { createInvalidMove } from "~/game-engine/core-engine/move/move-types";
import { logger } from "~/game-engine/core-engine/utils/logger";
import type { LorcanaCoreOperations } from "../operations/lorcana-core-operations";
import type { LorcanaMove } from "./types";
import { toLorcanaCoreOps } from "./types";

// **4.3.6. Challenge - Implementation based on Lorcana Comprehensive Rules**
//
// Challenge Flow (from Rules 4.3.6.5-4.3.6.18):
// 1. **Declare challenger**: Player announces challenging character (must be dry, ready, able to challenge)
// 2. **Choose target**: Select exerted opposing character OR any opposing location to challenge
// 3. **Check restrictions**: Verify no restrictions prevent the challenge (Evasive, Bodyguard, etc.)
// 4. **Exert challenger**: The challenging character becomes exerted
// 5. **Challenge occurs**: Both characters are now "in a challenge"
// 6. **Apply "while challenging" effects**: Temporary effects like Challenger keyword
// 7. **Add triggers to bag**: Effects that trigger from challenge starting
// 8. **Deal damage simultaneously**: Each character deals damage equal to their Strength to the other
// 9. **Apply damage modifications**: Handle Resist keyword, etc.
// 10. **Check for banishment**: Characters with damage >= Willpower are banished
// 11. **Add banishment triggers**: Effects that trigger from banishment in challenge
// 12. **End "while challenging" effects**: Clean up temporary effects
//
// Key Rules:
// - Only characters can challenge (4.3.6.1)
// - Can challenge exerted characters OR locations (4.3.6.7, 4.3.6.19-4.3.6.23)
// - Locations don't have Strength and don't deal damage back (4.3.6.22)
// - Evasive characters can only be challenged by Evasive characters (10.4.1)
// - Bodyguard characters must be challenged before non-Bodyguard (10.2.3)
// - Challenger keyword gives +N Strength while challenging (10.3.1)
// - Resist keyword reduces damage taken by N (10.6.1)

interface ChallengeOptions {
  targetInstanceId: string; // The character or location being challenged
}

interface ChallengeRestriction {
  blocked: boolean;
  errorCode: string;
  errorMessage: string;
  reason: string;
  context: Record<string, unknown>;
}

function checkChallengeRestrictions(
  lorcanaOps: any,
  challengerInstanceId: string,
  targetInstanceId: string,
  playerId: string,
): ChallengeRestriction {
  // Default to no restriction
  const noRestriction: ChallengeRestriction = {
    blocked: false,
    errorCode: "",
    errorMessage: "",
    reason: "",
    context: {},
  };

  const challenger = lorcanaOps.getCardInstance(challengerInstanceId);
  const target = lorcanaOps.getCardInstance(targetInstanceId);

  // Check that challenger and target are from different players
  const challengerOwner = lorcanaOps.getCardOwner(challengerInstanceId);
  const targetOwner = lorcanaOps.getCardOwner(targetInstanceId);

  if (challengerOwner === targetOwner) {
    return {
      blocked: true,
      errorCode: "SAME_PLAYER",
      errorMessage: "moves.challenge.errors.samePlayer",
      reason: "Cannot challenge your own cards",
      context: { challengerOwner, targetOwner },
    };
  }

  // Check for Evasive keyword (Rule 10.4.1)
  // A character with Evasive can only be challenged by a character with Evasive
  const hasKeyword = (card: any, keywordToCheck: string): boolean => {
    if (!(card.card.abilities && Array.isArray(card.card.abilities))) {
      return false;
    }

    return card.card.abilities.some(
      (ability: any) =>
        ability.type === "keyword" &&
        ability.keyword?.toLowerCase() === keywordToCheck.toLowerCase(),
    );
  };

  const targetHasEvasive = hasKeyword(target, "evasive");
  const challengerHasEvasive = hasKeyword(challenger, "evasive");

  if (
    target.card.type?.includes("Character") &&
    targetHasEvasive &&
    !challengerHasEvasive
  ) {
    return {
      blocked: true,
      errorCode: "TARGET_EVASIVE",
      errorMessage: "moves.challenge.errors.targetEvasive",
      reason: "Evasive characters can only be challenged by Evasive characters",
      context: { targetInstanceId },
    };
  }

  // TODO: Check for Bodyguard restriction (Rule 10.2.3)
  // If opponent has any ready Bodyguard character, other characters can't be challenged

  // No restriction applies
  return noRestriction;
}

export const challengeMove: LorcanaMove = (
  { G, coreOps, playerID },
  challengerInstanceId: string,
  options: ChallengeOptions,
) => {
  try {
    // Use explicit type assertion to ensure proper typing
    const lorcanaOps = toLorcanaCoreOps(
      coreOps,
    ) as unknown as LorcanaCoreOperations;

    // Use getCtx instead of directly accessing ctx
    const ctx = lorcanaOps.getCtx();

    logger.info(
      `Player ${playerID} attempting to challenge with ${challengerInstanceId} targeting ${options.targetInstanceId}`,
    );

    // Ensure we're in the main phase (this is a turn action)
    if (ctx.currentPhase !== "mainPhase") {
      logger.error(`Cannot challenge during ${ctx.currentPhase} phase`);
      return createInvalidMove(
        "WRONG_PHASE",
        "moves.challenge.errors.wrongPhase",
        { currentPhase: ctx.currentPhase, expectedPhase: "mainPhase" },
      );
    }

    const challengerInstance = lorcanaOps.getCardInstance(challengerInstanceId);
    if (!challengerInstance) {
      logger.error(`Failed to get challenger instance ${challengerInstanceId}`);
      return createInvalidMove(
        "CHALLENGER_NOT_FOUND",
        "moves.challenge.errors.challengerNotFound",
        { instanceId: challengerInstanceId },
      );
    }

    const targetInstance = lorcanaOps.getCardInstance(options.targetInstanceId);
    if (!targetInstance) {
      logger.error(`Failed to get target instance ${options.targetInstanceId}`);
      return createInvalidMove(
        "TARGET_NOT_FOUND",
        "moves.challenge.errors.targetNotFound",
        { instanceId: options.targetInstanceId },
      );
    }

    const challenger = challengerInstance;
    const target = targetInstance;

    // Verify challenger is a character
    if (!challenger.card.type?.includes("Character")) {
      logger.error(`Challenger ${challengerInstanceId} is not a character`);
      return createInvalidMove(
        "CHALLENGER_NOT_CHARACTER",
        "moves.challenge.errors.challengerNotCharacter",
        { instanceId: challengerInstanceId, cardType: challenger.card.type },
      );
    }

    // Verify target is a character or location
    const isTargetLocation = target.card.type?.includes("Location");
    const isTargetCharacter = target.card.type?.includes("Character");

    if (!(isTargetCharacter || isTargetLocation)) {
      logger.error(
        `Target ${options.targetInstanceId} is not a character or location`,
      );
      return createInvalidMove(
        "TARGET_NOT_CHARACTER_OR_LOCATION",
        "moves.challenge.errors.targetNotCharacterOrLocation",
        {
          instanceId: options.targetInstanceId,
          cardType: target.card.type,
        },
      );
    }

    // Verify both challenger and target are in play zone
    const challengerZone = lorcanaOps.getCardZone(challengerInstanceId);
    const targetZone = lorcanaOps.getCardZone(options.targetInstanceId);

    if (challengerZone !== "play") {
      logger.error(`Challenger ${challengerInstanceId} is not in play zone`);
      return createInvalidMove(
        "CHALLENGER_NOT_IN_PLAY",
        "moves.challenge.errors.challengerNotInPlay",
        { instanceId: challengerInstanceId, zone: challengerZone },
      );
    }

    if (targetZone !== "play") {
      logger.error(`Target ${options.targetInstanceId} is not in play zone`);
      return createInvalidMove(
        "TARGET_NOT_IN_PLAY",
        "moves.challenge.errors.targetNotInPlay",
        { instanceId: options.targetInstanceId, zone: targetZone },
      );
    }

    // Check if the target character is exerted (only exerted characters can be challenged - Rule 4.3.6.7)
    // Locations can be challenged regardless of their exerted status (Rule 4.3.6.19)
    if (isTargetCharacter && !target.isExerted) {
      logger.error(
        `Target character ${options.targetInstanceId} must be exerted to be challenged`,
      );
      return createInvalidMove(
        "TARGET_NOT_EXERTED",
        "moves.challenge.errors.targetNotExerted",
        { instanceId: options.targetInstanceId },
      );
    }

    // Extract abilities for checking keywords instead of accessing keywords directly
    const hasKeyword = (card: any, keywordToCheck: string): boolean => {
      if (!(card.card.abilities && Array.isArray(card.card.abilities))) {
        return false;
      }

      return card.card.abilities.some(
        (ability: any) =>
          ability.type === "keyword" &&
          ability.keyword?.toLowerCase() === keywordToCheck.toLowerCase(),
      );
    };

    const hasRush = hasKeyword(challenger, "rush");
    const wasPlayedThisTurn = challenger.meta.playedThisTurn === true;

    const canChallengeNormally =
      lorcanaOps.canCharacterChallenge(challengerInstanceId);
    const canChallengeWithRush = hasRush && wasPlayedThisTurn;

    if (!(canChallengeNormally || canChallengeWithRush)) {
      const reason =
        hasRush && wasPlayedThisTurn
          ? "Character with Rush played this turn but still can't challenge"
          : "Character is exerted or unable to challenge";

      logger.error(
        `Character ${challengerInstanceId} cannot challenge: ${reason}`,
      );
      return createInvalidMove(
        "CHALLENGER_CANNOT_CHALLENGE",
        "moves.challenge.errors.challengerCannotChallenge",
        {
          instanceId: challengerInstanceId,
          reason,
        },
      );
    }

    // Check for challenge restrictions on the challenger
    const challengeRestrictions = checkChallengeRestrictions(
      lorcanaOps,
      challengerInstanceId,
      options.targetInstanceId,
      playerID,
    );

    if (challengeRestrictions.blocked) {
      logger.error(`Challenge blocked: ${challengeRestrictions.reason}`);
      return createInvalidMove(
        challengeRestrictions.errorCode,
        challengeRestrictions.errorMessage,
        challengeRestrictions.context,
      );
    }

    // Calculate base strength values
    let challengerStrength = challenger.card.strength || 0;
    const targetStrength = isTargetLocation ? 0 : target.card.strength || 0;

    // Apply Challenger keyword bonus (while challenging)
    // Check for Challenger ability and extract the bonus value
    const getChallengerBonus = (card: any): number => {
      if (!(card.card.abilities && Array.isArray(card.card.abilities))) {
        return 0;
      }

      return card.card.abilities.reduce((bonus: number, ability: any) => {
        if (
          ability.type === "keyword" &&
          ability.keyword?.startsWith("challenger")
        ) {
          // Extract the numeric value from challenger ability
          const match = ability.keyword.match(/challenger\+?(\d+)/i);
          return bonus + (match ? Number.parseInt(match[1]) : 1);
        }
        return bonus;
      }, 0);
    };

    const challengerBonus = getChallengerBonus(challenger);
    challengerStrength += challengerBonus;

    // Exert the challenging character (Rule 4.3.6.9)
    logger.info(`Exerting challenger ${challengerInstanceId}`);
    lorcanaOps.exertCard(challengerInstanceId);

    // Apply "while challenging" effects
    logger.info("Applying 'while challenging' effects");
    // TODO: Implement dynamic effect system for temporary modifiers

    // Add triggered effects to the bag (rule 4.3.6.6)
    logger.info("Adding challenge triggers to the bag");
    // TODO: Implement proper triggered ability system
    // This should handle abilities like "Whenever this character challenges..."

    // Deal damage simultaneously (rule 4.3.6.13)
    logger.info(
      `Challenge damage step: Challenger (${challengerStrength}) vs Target (${targetStrength})`,
    );

    const challengerDamageToTake = targetStrength;
    let targetDamageToTake = challengerStrength;

    // Apply Resist keyword (damage reduction)
    // Check for Resist ability and extract the reduction value
    const getResistReduction = (card: any): number => {
      if (!(card.card.abilities && Array.isArray(card.card.abilities))) {
        return 0;
      }

      return card.card.abilities.reduce((reduction: number, ability: any) => {
        if (
          ability.type === "keyword" &&
          ability.keyword?.startsWith("resist")
        ) {
          // Extract the numeric value from resist ability
          const match = ability.keyword.match(/resist\+?(\d+)/i);
          return reduction + (match ? Number.parseInt(match[1]) : 1);
        }
        return reduction;
      }, 0);
    };

    const targetResist = getResistReduction(target);
    targetDamageToTake = Math.max(0, targetDamageToTake - targetResist);

    // Apply damage counters (Rule 4.3.6.16)
    if (targetDamageToTake > 0) {
      logger.info(
        `Challenger deals ${targetDamageToTake} damage to target (after Resist: ${targetResist})`,
      );
      lorcanaOps.applyDamage(options.targetInstanceId, targetDamageToTake);
    }

    if (challengerDamageToTake > 0 && isTargetCharacter) {
      logger.info(
        `Target deals ${challengerDamageToTake} damage to challenger`,
      );
      lorcanaOps.applyDamage(challengerInstanceId, challengerDamageToTake);
    }

    // Game state check will automatically handle banishment (Rule 1.9.1.3)
    // Characters/locations with damage >= willpower are banished
    lorcanaOps.gameStateCheck();

    // End "while challenging" effects (rule 4.3.6.18)
    logger.info("Ending 'while challenging' effects");
    // TODO: Clean up temporary effects and modifiers

    logger.info(
      `Player ${playerID} challenged ${options.targetInstanceId} with ${challengerInstanceId}`,
    );

    return G;
  } catch (error) {
    logger.error(`Unexpected error in challengeMove: ${error}`);
    return createInvalidMove(
      "UNEXPECTED_ERROR",
      "moves.challenge.errors.unexpectedError",
      {
        error: String(error),
        challengerInstanceId,
        targetInstanceId: options?.targetInstanceId,
        playerId: playerID,
      },
    );
  }
};
