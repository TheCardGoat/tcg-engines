import { createInvalidMove } from "~/game-engine/core-engine/move/move-types";
import { logger } from "~/game-engine/core-engine/utils/logger";
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
  reason?: string;
  errorCode?: string;
  errorMessage?: string;
  context?: any;
}

/**
 * Check for effects that prevent or restrict challenges
 * Returns restriction info if challenge should be blocked
 */
function checkChallengeRestrictions(
  lorcanaOps: any,
  challengerInstanceId: string,
  targetInstanceId: string,
  playerId: string,
): ChallengeRestriction {
  const challenger = lorcanaOps.getCardInstance(challengerInstanceId);
  const target = lorcanaOps.getCardInstance(targetInstanceId);

  if (!(challenger && target)) {
    return {
      blocked: true,
      reason: "Card not found",
      errorCode: "CARD_NOT_FOUND",
      errorMessage: "moves.challenge.errors.cardNotFound",
      context: { challengerInstanceId, targetInstanceId },
    };
  }

  const challengerKeywords = (challenger.card as any).keywords || [];
  const targetKeywords = (target.card as any).keywords || [];

  // Check for "can't challenge" effects on challenger
  // Some cards have text like "This character can't challenge"
  if (hasRestriction(challengerKeywords, "CantChallenge")) {
    return {
      blocked: true,
      reason: "Challenger has 'can't challenge' restriction",
      errorCode: "CHALLENGER_CANT_CHALLENGE",
      errorMessage: "moves.challenge.errors.challengerCantChallenge",
      context: { challengerInstanceId },
    };
  }

  // Check for "can't be challenged" effects on target
  // Some cards have text like "This character can't be challenged"
  if (hasRestriction(targetKeywords, "CantBeChallenged")) {
    return {
      blocked: true,
      reason: "Target has 'can't be challenged' restriction",
      errorCode: "TARGET_CANT_BE_CHALLENGED",
      errorMessage: "moves.challenge.errors.targetCantBeChallenged",
      context: { targetInstanceId },
    };
  }

  // Check for Ward keyword - prevents being chosen by opponent's effects
  // While Ward typically applies to spells/abilities, some interpretations include challenges
  if (targetKeywords.includes("Ward")) {
    const targetOwner = lorcanaOps.getCardOwner(targetInstanceId);
    if (targetOwner !== playerId) {
      return {
        blocked: true,
        reason: "Target has Ward and is controlled by opponent",
        errorCode: "TARGET_HAS_WARD",
        errorMessage: "moves.challenge.errors.targetHasWard",
        context: { targetInstanceId },
      };
    }
  }

  // Check for Reckless keyword restrictions
  // Reckless characters can't quest and must challenge if able
  const hasReckless = challengerKeywords.some((k: string) =>
    k.includes("Reckless"),
  );
  if (hasReckless) {
    // Reckless characters get a preference bonus for challenging (handled elsewhere)
    // But they don't get blocked from challenging - they're encouraged to challenge
  }

  // No restrictions found
  return { blocked: false };
}

/**
 * Helper function to check if a card has a specific restriction keyword
 */
function hasRestriction(keywords: string[], restriction: string): boolean {
  return keywords.some(
    (keyword) =>
      keyword.includes(restriction) ||
      keyword.toLowerCase().includes(restriction.toLowerCase()),
  );
}

export const challengeMove: LorcanaMove = (
  { G, coreOps, playerID },
  challengerInstanceId: string,
  options: ChallengeOptions,
) => {
  try {
    const lorcanaOps = toLorcanaCoreOps(coreOps);
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

    // Verify challenger is in player's play zone
    const playerPlayCards = lorcanaOps.getCardsInZone("play", playerID);
    if (
      !playerPlayCards.find((card) => card.instanceId === challengerInstanceId)
    ) {
      logger.error(
        `Challenger ${challengerInstanceId} is not in player ${playerID}'s play zone`,
      );
      return createInvalidMove(
        "CHALLENGER_NOT_IN_PLAY",
        "moves.challenge.errors.challengerNotInPlay",
        { instanceId: challengerInstanceId, playerId: playerID },
      );
    }

    // Verify target is either an exerted character or a location
    const isTargetCharacter = target.card.type?.includes("Character");
    const isTargetLocation = target.card.type?.includes("Location");

    if (!(isTargetCharacter || isTargetLocation)) {
      logger.error(
        `Target ${options.targetInstanceId} is neither a character nor a location`,
      );
      return createInvalidMove(
        "INVALID_TARGET_TYPE",
        "moves.challenge.errors.invalidTargetType",
        { instanceId: options.targetInstanceId, cardType: target.card.type },
      );
    }

    // If target is a character, it must be exerted (Rule 4.3.6.7)
    if (isTargetCharacter) {
      const targetCharacter = target;
      if (!targetCharacter.isExerted) {
        logger.error(
          `Cannot challenge ready character ${options.targetInstanceId} - target must be exerted`,
        );
        return createInvalidMove(
          "TARGET_NOT_EXERTED",
          "moves.challenge.errors.targetNotExerted",
          { instanceId: options.targetInstanceId },
        );
      }
      logger.info(`Challenging exerted character ${options.targetInstanceId}`);
    }

    // Verify target is controlled by opponent
    const targetOwner = lorcanaOps.getCardOwner(options.targetInstanceId);
    if (targetOwner === playerID) {
      logger.error(`Cannot challenge own card ${options.targetInstanceId}`);
      return createInvalidMove(
        "CANNOT_CHALLENGE_OWN_CARD",
        "moves.challenge.errors.cannotChallengeOwnCard",
        { instanceId: options.targetInstanceId, playerId: playerID },
      );
    }

    // Check for Evasive restriction
    const targetKeywords = (target.card as any).keywords || [];
    const challengerKeywords = (challenger.card as any).keywords || [];

    if (
      targetKeywords.includes("Evasive") &&
      !challengerKeywords.includes("Evasive")
    ) {
      logger.error(
        `Cannot challenge Evasive character ${options.targetInstanceId} without Evasive challenger`,
      );
      return createInvalidMove(
        "TARGET_EVASIVE",
        "moves.challenge.errors.targetEvasive",
        {
          challengerInstanceId,
          targetInstanceId: options.targetInstanceId,
        },
      );
    }

    // Check for Bodyguard restriction
    if (isTargetCharacter && !targetKeywords.includes("Bodyguard")) {
      // If target doesn't have Bodyguard, check if there's a Bodyguard that must be challenged first
      const opponentPlayCards = lorcanaOps.getCardsInZone("play", targetOwner!);
      const bodyguardCards = opponentPlayCards.filter((card) => {
        const cardKeywords = (card.card as any).keywords || [];
        return (
          cardKeywords.includes("Bodyguard") &&
          card.instanceId !== options.targetInstanceId
        );
      });

      if (bodyguardCards.length > 0) {
        logger.error("Must challenge Bodyguard character first");
        return createInvalidMove(
          "MUST_CHALLENGE_BODYGUARD",
          "moves.challenge.errors.mustChallengeBodyguard",
          {
            targetInstanceId: options.targetInstanceId,
            bodyguardCards: bodyguardCards.map((c) => c.instanceId),
          },
        );
      }
    }

    // Check if challenger can challenge (must be ready/not exerted)
    // Exception: Rush characters can challenge when they're played this turn
    const challengerMeta = lorcanaOps.state.G.metas[challengerInstanceId] || {};
    const hasRush = challengerKeywords.some((k: string) => k.includes("Rush"));
    const wasPlayedThisTurn = challengerMeta.playedThisTurn === true;

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
    let challengerStrength = (challenger.card as any).strength || 0;
    const targetStrength = isTargetLocation
      ? 0
      : (target.card as any).strength || 0;

    // Apply Challenger keyword bonus (while challenging)
    const challengerKeywordsArray = challengerKeywords as string[];
    const challengerBonus = challengerKeywordsArray
      .filter((k) => k.startsWith("Challenger"))
      .reduce((bonus, keyword) => {
        const match = keyword.match(/Challenger\s*\+?(\d+)/);
        return bonus + (match ? Number.parseInt(match[1]) : 1);
      }, 0);

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
    const targetKeywordsArray = targetKeywords as string[];
    const targetResist = targetKeywordsArray
      .filter((k) => k.startsWith("Resist"))
      .reduce((resist, keyword) => {
        const match = keyword.match(/Resist\s*\+?(\d+)/);
        return resist + (match ? Number.parseInt(match[1]) : 1);
      }, 0);

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
