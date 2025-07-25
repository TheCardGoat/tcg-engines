import { createInvalidMove } from "~/game-engine/core-engine/move/move-types";
import { logger } from "~/game-engine/core-engine/utils/logger";
import { AbilityBuilder } from "../abilities/ability-builder";
import type { LorcanaAbilityCost } from "../abilities/ability-types";
import { detectAbilityType } from "../examples/ability-type-mapping";
import type { LorcanaMove } from "./types";
import { toLorcanaCoreOps } from "./types";

// **7.5. Activated Abilities**
// **7.5.1.** Activated abilities are abilities that a player chooses to use. They are normally written as [Cost] — [Effect].
// **7.5.2.** While there are no effects waiting to resolve and a character isn't questing or in a challenge, the active player may use an activated ability.
// **7.5.3.** To use an activated ability, the active player follows these steps in order. If any part of this process can't be performed, it's illegal to use the ability.
// **7.5.3.1.** First, the active player announces the ability they intend to use.
// **7.5.3.2.** Second, the player follows the steps described in 4.3.4.4 through 4.3.4.6, replacing any instance of the word "card" with the word "ability."
// **7.5.3.3.** Once the total cost is paid, the ability is activated. The active player resolves the effect immediately.
// **7.5.4.** If an effect would trigger as a result of any of the steps to using an activated ability, that effect waits to resolve until the ability is fully resolved.

export interface ActivatedAbilityParams {
  cardInstanceId: string; // Card with the activated ability
  abilityIndex?: number; // If the card has multiple activated abilities, the index of the one to use (0-based)
  abilityText?: string; // Specific ability text to use (if not provided, will be detected)
}

export const useActivatedAbility: LorcanaMove = (
  { G, coreOps, playerID },
  params: ActivatedAbilityParams,
) => {
  try {
    const lorcanaOps = toLorcanaCoreOps(coreOps);
    const ctx = lorcanaOps.getCtx();

    // **7.5.3.1.** First, the active player announces the ability they intend to use.
    logger.info(
      `Player ${playerID} announces intention to use activated ability on card ${params.cardInstanceId}`,
    );

    // **7.5.2.** While there are no effects waiting to resolve and a character isn't questing or in a challenge, the active player may use an activated ability.
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

    // TODO: Check if there are effects waiting to resolve (bag not empty)
    // TODO: Check if character is questing or in a challenge

    const { cardInstanceId, abilityIndex = 0, abilityText } = params;

    // Verify card exists
    const cardInstance = lorcanaOps.getCardInstance(cardInstanceId);
    if (!cardInstance) {
      logger.error(`Failed to get card instance ${cardInstanceId}`);
      return createInvalidMove(
        "CARD_NOT_FOUND",
        "moves.useActivatedAbility.errors.cardNotFound",
        { instanceId: cardInstanceId },
      );
    }

    // Verify card is in play
    const cardZone = lorcanaOps.getCardZone(cardInstanceId);
    if (cardZone !== "play") {
      logger.error(`Card ${cardInstanceId} is not in play (zone: ${cardZone})`);
      return createInvalidMove(
        "CARD_NOT_IN_PLAY",
        "moves.useActivatedAbility.errors.cardNotInPlay",
        { instanceId: cardInstanceId, cardZone },
      );
    }

    // Verify card is controlled by the player
    const cardOwner = lorcanaOps.getCardOwner(cardInstanceId);
    if (cardOwner !== playerID) {
      logger.error(
        `Card ${cardInstanceId} is not controlled by player ${playerID}`,
      );
      return createInvalidMove(
        "CARD_NOT_CONTROLLED",
        "moves.useActivatedAbility.errors.cardNotControlled",
        { instanceId: cardInstanceId, playerId: playerID },
      );
    }

    // Extract activated abilities from the card
    const activatedAbilities = extractActivatedAbilities(cardInstance);
    if (activatedAbilities.length === 0) {
      logger.error(`Card ${cardInstanceId} has no activated abilities`);
      return createInvalidMove(
        "NO_ACTIVATED_ABILITIES",
        "moves.useActivatedAbility.errors.noActivatedAbilities",
        { instanceId: cardInstanceId },
      );
    }

    // Select the specific ability to use
    let selectedAbility: string;
    if (abilityText) {
      selectedAbility = abilityText;
    } else if (abilityIndex < activatedAbilities.length) {
      selectedAbility = activatedAbilities[abilityIndex];
    } else {
      logger.error(
        `Invalid ability index ${abilityIndex} for card ${cardInstanceId}. Available abilities: ${activatedAbilities.length}`,
      );
      return createInvalidMove(
        "INVALID_ABILITY_INDEX",
        "moves.useActivatedAbility.errors.invalidAbilityIndex",
        {
          instanceId: cardInstanceId,
          abilityIndex,
          availableCount: activatedAbilities.length,
        },
      );
    }

    // Extract cost from the selected ability
    const abilityCost = AbilityBuilder.extractCost(selectedAbility);

    // **7.5.3.2.** Second, the player follows the steps described in 4.3.4.4 through 4.3.4.6 (cost determination and payment)
    // **4.3.4.4.** Determine the total cost (no alternate costs for abilities currently)
    const totalCost = calculateTotalAbilityCost(abilityCost);

    // **4.3.4.5.** Check if player can pay the total cost
    const canPayCost = validateCanPayAbilityCost(
      lorcanaOps,
      playerID,
      cardInstanceId,
      abilityCost,
    );
    if (!canPayCost.valid) {
      logger.error(
        `Player ${playerID} cannot pay ability cost: ${canPayCost.reason}`,
      );
      return createInvalidMove(
        canPayCost.errorType,
        `moves.useActivatedAbility.errors.${canPayCost.errorType}`,
        {
          instanceId: cardInstanceId,
          playerId: playerID,
          reason: canPayCost.reason,
        },
      );
    }

    // **4.3.4.6.** Pay the total cost
    const paymentResult = payAbilityCost(
      lorcanaOps,
      playerID,
      cardInstanceId,
      abilityCost,
    );
    if (!paymentResult.success) {
      logger.error(`Failed to pay ability cost: ${paymentResult.reason}`);
      return createInvalidMove(
        "PAYMENT_FAILED",
        "moves.useActivatedAbility.errors.paymentFailed",
        {
          instanceId: cardInstanceId,
          playerId: playerID,
          reason: paymentResult.reason,
        },
      );
    }

    // **7.5.3.3.** Once the total cost is paid, the ability is activated. The active player resolves the effect immediately.
    // Note: Effect resolution is left for later implementation as mentioned in the requirements
    logger.info(
      `Activated ability ${abilityIndex} on card ${cardInstanceId} has been activated and cost paid`,
    );

    // **7.5.4.** Effects that would trigger as a result of using an activated ability wait to resolve until the ability is fully resolved
    // TODO: Add triggered effects to the bag after ability resolution (not before)
    // This would be implemented when bag handling is completed

    logger.info(
      `Player ${playerID} successfully used activated ability ${abilityIndex} on card ${cardInstanceId}`,
    );

    return G;
  } catch (error) {
    logger.error(`Unexpected error in useActivatedAbilityMove: ${error}`);
    return createInvalidMove(
      "UNEXPECTED_ERROR",
      "moves.useActivatedAbility.errors.unexpectedError",
      {
        error: String(error),
        cardInstanceId: params?.cardInstanceId,
        playerId: playerID,
      },
    );
  }
};

/**
 * Extracts activated abilities from a card instance
 * @param cardInstance The card instance to analyze
 * @returns Array of activated ability texts
 */
function extractActivatedAbilities(cardInstance: any): string[] {
  const abilities: string[] = [];
  const cardText =
    cardInstance.card.text || cardInstance.card.abilities?.join(" ") || "";

  if (!cardText) return abilities;

  // Split card text into individual abilities (separated by periods or newlines)
  const abilityTexts = cardText
    .split(/[.\n]/)
    .map((text: string) => text.trim())
    .filter((text: string) => text.length > 0);

  for (const abilityText of abilityTexts) {
    if (detectAbilityType(abilityText) === "activated") {
      abilities.push(abilityText);
    }
  }

  return abilities;
}

/**
 * Calculates the total cost of an activated ability
 * @param abilityCost The parsed ability cost
 * @returns Total ink cost (other costs are handled separately)
 */
function calculateTotalAbilityCost(abilityCost: LorcanaAbilityCost): number {
  // For now, only return ink cost. Other costs (like exert, banish) are handled separately
  return abilityCost.ink || 0;
}

/**
 * Validates if a player can pay the cost of an activated ability
 * @param lorcanaOps The core operations instance
 * @param playerID The player attempting to use the ability
 * @param cardInstanceId The card with the activated ability
 * @param abilityCost The parsed ability cost
 * @returns Validation result
 */
function validateCanPayAbilityCost(
  lorcanaOps: any,
  playerID: string,
  cardInstanceId: string,
  abilityCost: LorcanaAbilityCost,
): { valid: boolean; reason?: string; errorType?: string } {
  // Check exert cost
  if (abilityCost.exert) {
    const cardInstance = lorcanaOps.getCardInstance(cardInstanceId);
    if (!cardInstance) {
      return {
        valid: false,
        reason: "Card not found",
        errorType: "CARD_NOT_FOUND",
      };
    }

    if (cardInstance.isExerted) {
      return {
        valid: false,
        reason: "Card is already exerted",
        errorType: "CARD_ALREADY_EXERTED",
      };
    }

    // Check if character is "drying" (played this turn) - they can't exert for abilities
    if (cardInstance.card.type?.includes("Character")) {
      // TODO: Add proper "drying" check when character state tracking is implemented
      // For now, assume characters can use abilities if they're ready
    }
  }

  // Check ink cost
  if (abilityCost.ink && abilityCost.ink > 0) {
    const availableInk = lorcanaOps.getAvailableInk(playerID);
    if (availableInk < abilityCost.ink) {
      return {
        valid: false,
        reason: `Insufficient ink: required ${abilityCost.ink}, available ${availableInk}`,
        errorType: "INSUFFICIENT_INK",
      };
    }
  }

  // TODO: Add validation for other cost types (banish, discard, etc.) as needed

  return { valid: true };
}

/**
 * Pays the cost of an activated ability
 * @param lorcanaOps The core operations instance
 * @param playerID The player using the ability
 * @param cardInstanceId The card with the activated ability
 * @param abilityCost The parsed ability cost
 * @returns Payment result
 */
function payAbilityCost(
  lorcanaOps: any,
  playerID: string,
  cardInstanceId: string,
  abilityCost: LorcanaAbilityCost,
): { success: boolean; reason?: string } {
  try {
    // Pay exert cost
    if (abilityCost.exert) {
      const exertResult = lorcanaOps.exertCard(cardInstanceId);
      if (exertResult) {
        return {
          success: false,
          reason: `Failed to exert card: ${exertResult}`,
        };
      }
    }

    // Pay ink cost
    if (abilityCost.ink && abilityCost.ink > 0) {
      const paymentResult = lorcanaOps.exertInkForCost(
        playerID,
        abilityCost.ink,
      );
      if (!paymentResult) {
        return {
          success: false,
          reason: `Failed to pay ${abilityCost.ink} ink`,
        };
      }
    }

    // TODO: Handle other cost types (banish, discard, etc.) as needed

    return { success: true };
  } catch (error) {
    return { success: false, reason: `Payment error: ${error}` };
  }
}
