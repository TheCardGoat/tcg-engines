import { createInvalidMove } from "~/game-engine/core-engine/move/move-types";
import { logger } from "~/game-engine/core-engine/utils/logger";
import type { LorcanaMove } from "./types";
import { toLorcanaCoreOps } from "./types";

// **4.3.6. Challenge**
// **4.3.6.1.** The player declares that a character they control is challenging.
// **4.3.6.2.** Choose an exerted opposing character or location to challenge.
// **4.3.6.3.** Check for challenge restrictions.
// **4.3.6.4.** Exert the challenging character.
// **4.3.6.5.** Apply "while challenging" effects.
// **4.3.6.6.** Add triggered abilities to the bag.
// **4.3.6.7.** Deal damage equal to Strength simultaneously.
// **4.3.6.8.** Add banishment triggers to bag if needed.
// **4.3.6.9.** End "while challenging" effects.

interface ChallengeOptions {
  targetInstanceId: string; // The character or location being challenged
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

    // If target is a character, it must be exerted
    if (isTargetCharacter) {
      // Note: This would need proper character state tracking for exerted status
      // For now, we assume the validation passes
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
    // Note: This would need proper character state tracking
    // For now, we assume the challenger is ready

    // Get strength values for damage calculation
    const challengerStrength = (challenger.card as any).strength || 0;
    const targetStrength = isTargetLocation
      ? 0
      : (target.card as any).strength || 0;

    // Exert the challenging character
    logger.info(`Exerting challenger ${challengerInstanceId}`);

    // Apply "while challenging" effects
    // Note: This would need to be implemented based on specific card abilities

    // Add triggered effects to the bag (rule 4.3.6.5)
    lorcanaOps.addTriggeredEffectsToTheBag("onChallenge", challengerInstanceId);

    // Deal damage simultaneously
    if (challengerStrength > 0) {
      logger.info(`Challenger deals ${challengerStrength} damage to target`);
      // Note: This would need proper damage tracking system
    }

    if (targetStrength > 0 && isTargetCharacter) {
      logger.info(`Target deals ${targetStrength} damage to challenger`);
      // Note: This would need proper damage tracking system
    }

    // Check for banishment (when damage >= willpower)
    const challengerWillpower = (challenger.card as any).willpower || 0;
    const targetWillpower = isTargetLocation
      ? (target.card as any).willpower || 0
      : (target.card as any).willpower || 0;

    if (targetStrength >= challengerWillpower && challengerWillpower > 0) {
      logger.info(`Challenger ${challengerInstanceId} is banished`);
      // Add banishment trigger to bag
      lorcanaOps.addTriggeredEffectsToTheBag("onBanish", challengerInstanceId);
    }

    if (challengerStrength >= targetWillpower && targetWillpower > 0) {
      logger.info(`Target ${options.targetInstanceId} is banished`);
      // Add banishment trigger to bag
      lorcanaOps.addTriggeredEffectsToTheBag(
        "onBanish",
        options.targetInstanceId,
      );
    }

    // End "while challenging" effects
    // Note: This would clean up temporary effects

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
