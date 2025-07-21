import { CoreOperation } from "~/game-engine/core-engine/engine/core-operation";
import type { LorcanaCardInstance } from "../cards/lorcana-card-instance";
import type { LorcanaEngine } from "../lorcana-engine";
import type { LorcanaGameState, TriggerTiming } from "../lorcana-engine-types";
import type {
  LorcanaCardDefinition,
  LorcanaCardFilter,
  LorcanaPlayerState,
} from "../lorcana-generic-types";
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
  resolveBag as resolveBagImpl,
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
    if (!this.state.G.metas[cardId]) {
      this.state.G.metas[cardId] = {};
    }
    this.state.G.metas[cardId].exerted = true;
  }

  /**
   * Ready a card (Lorcana-specific state change)
   */
  readyCard(cardId: string): void {
    if (this.state.G.metas[cardId]) {
      this.state.G.metas[cardId].exerted = false;
    }
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

  resolveBagTrigger(id: string) {
    resolveBagImpl.call(this, id);
  }
}
