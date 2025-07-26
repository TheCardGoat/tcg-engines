import { CoreOperation } from "~/game-engine/core-engine/engine/core-operation";
import { logger } from "~/game-engine/core-engine/utils";
import type { TriggerTiming } from "~/game-engine/engines/lorcana/src/abilities/ability-types";
import type { LorcanaCardInstance } from "../cards/lorcana-card-instance";
import type { LorcanaEngine } from "../lorcana-engine";
import type {
  LorcanaCardDefinition,
  LorcanaCardFilter,
  LorcanaCardMeta,
  LorcanaGameState,
  LorcanaPlayerState,
} from "../lorcana-engine-types";
import {
  addTriggeredEffectsToTheBag as addTriggeredEffectsToTheBagImpl,
  canCharacterChallenge as canCharacterChallengeImpl,
  canCharacterQuest as canCharacterQuestImpl,
  challengeCharacter as challengeCharacterImpl,
  enterLocation as enterLocationImpl,
  exertInkForCost as exertInkForCostImpl,
  gameStateCheck as gameStateCheckImpl,
  getAvailableInk as getAvailableInkImpl,
  leaveLocation as leaveLocationImpl,
  questWithCharacter as questWithCharacterImpl,
  readyAllCharacters as readyAllCharactersImpl,
  readyAllInk as readyAllInkImpl,
  resolveBagTrigger as resolveBagTriggerImpl,
} from "./modules";

/**
 * NOTE: Functions with more than 5 lines of code must be extracted to a module
 * under the operations/modules folder for better maintainability and testability.
 */
export class LorcanaCoreOperations extends CoreOperation<
  LorcanaGameState,
  LorcanaCardDefinition,
  LorcanaPlayerState,
  LorcanaCardFilter,
  LorcanaCardMeta,
  LorcanaCardInstance
> {
  /**
   * Type-safe access to LorcanaEngine
   */
  protected get lorcanaEngine(): LorcanaEngine {
    return this.engine as LorcanaEngine;
  }

  /**
   * Challenge one character with another
   * Implements Lorcana-specific challenge mechanics
   */
  challengeCharacter(attackerId: string, defenderId: string): void {
    challengeCharacterImpl.call(this, attackerId, defenderId);
  }

  /**
   * Quest with a character
   * Implements Lorcana-specific questing mechanics
   */
  questWithCharacter(characterId: string): void {
    questWithCharacterImpl.call(this, characterId);
  }

  gameStateCheck(): void {
    gameStateCheckImpl.call(this);
  }

  /**
   * Add card to inkwell (Lorcana-specific mechanic)
   */
  addToInkwell(cardId: string, playerId: string): void {
    this.moveCard({
      playerId,
      instanceId: cardId,
      to: "inkwell",
    });
  }

  /**
   * Get ink cost for a card (Lorcana-specific)
   */
  private getInkCost(cardId: string): number {
    const card = this.getCardInstance(cardId);
    return card.card.cost || 0;
  }

  /**
   * Exert a card (Lorcana-specific state change)
   */
  exertCard(cardId: string): void {
    this.updateCardMeta(cardId, "exerted", true);
  }

  /**
   * Ready a card (Lorcana-specific state change)
   */
  readyCard(cardId: string): void {
    this.updateCardMeta(cardId, "exerted", false);
  }

  /**
   * Apply damage to a character or location (Lorcana-specific damage system)
   * Damage accumulates on the card until it's banished or healed
   */
  applyDamage(cardId: string, damage: number): void {
    if (damage <= 0) return; // No damage to apply

    // Add damage to existing damage (damage accumulates)
    const currentDamage = this.getCardMeta(cardId).damage || 0;
    this.updateCardMeta(cardId, "damage", currentDamage + damage);

    logger.debug(
      `Applied ${damage} damage to ${cardId}, total damage: ${this.getCardMeta(cardId).damage}`,
    );
  }

  /**
   * Get the current damage on a card
   */
  getDamage(cardId: string): number {
    return this.getCardMeta(cardId).damage || 0;
  }

  /**
   * Remove damage from a card (for healing effects)
   */
  removeDamage(cardId: string, amount: number): void {
    if (amount <= 0) return;

    const currentDamage = this.getCardMeta(cardId).damage || 0;
    this.updateCardMeta(cardId, "damage", Math.max(0, currentDamage - amount));

    logger.debug(
      `Removed ${amount} damage from ${cardId}, remaining damage: ${this.getCardMeta(cardId).damage}`,
    );
  }

  /**
   * Check if a character can quest (Lorcana-specific rules)
   */
  canCharacterQuest(characterId: string): boolean {
    return canCharacterQuestImpl.call(this, characterId);
  }

  /**
   * Check if a character can challenge (Lorcana-specific rules)
   */
  canCharacterChallenge(characterId: string): boolean {
    return canCharacterChallengeImpl.call(this, characterId);
  }

  /**
   * Ready all characters for a player (start of turn in Lorcana)
   */
  readyAllCharacters(playerId: string): void {
    readyAllCharactersImpl.call(this, playerId);
  }

  /**
   * Ready all ink cards for a player (start of turn in Lorcana)
   */
  readyAllInk(playerId: string): void {
    readyAllInkImpl.call(this, playerId);
  }

  /**
   * Make a character leave its current location (Lorcana-specific mechanic)
   */
  leaveLocation(char: LorcanaCardInstance): void {
    leaveLocationImpl.call(this, char);
  }

  /**
   * Make a character enter a location (Lorcana-specific mechanic)
   */
  enterLocation(
    char: LorcanaCardInstance,
    location: LorcanaCardInstance,
  ): void {
    enterLocationImpl.call(this, char, location);
  }

  /**
   * Get the number of available (ready) ink cards for a player
   * This is used for cost validation
   */
  getAvailableInk(playerId: string): number {
    return getAvailableInkImpl.call(this, playerId);
  }

  /**
   * Exert ink cards to pay for costs
   * This is a Lorcana-specific mechanism for paying costs with ink
   */
  exertInkForCost(playerId: string, cost: number): boolean {
    return exertInkForCostImpl.call(this, playerId, cost);
  }

  /**
   * Add triggered effects to the bag for processing
   * This is a Lorcana-specific mechanism for handling card triggers
   */
  addTriggeredEffectsToTheBag(
    timing: TriggerTiming,
    cardInstanceId?: string,
  ): void {
    addTriggeredEffectsToTheBagImpl.call(this, { timing, cardInstanceId });
  }

  resolveBagTrigger(id: string): void {
    resolveBagTriggerImpl.call(this, id);
  }

  /**
   * Process turn start triggers and add to bag (Lorcana-specific implementation)
   * Override the base implementation to call our trigger system
   */
  processTurnStartTriggers(): void {
    // Call the Lorcana-specific trigger system
    this.addTriggeredEffectsToTheBag("startOfTurn");
  }

  addLoreToPlayer(playerId: string, lore: number): void {
    if (this.state.ctx.players[playerId]) {
      const playerState = this.state.ctx.players[playerId] as any;
      if (!playerState.lore) {
        playerState.lore = 0;
      }
      playerState.lore += lore;
      logger.log(
        `DEBUG: Player ${playerId} gains ${lore} lore from triggered effect (total: ${playerState.lore})`,
      );
    }
  }
}
