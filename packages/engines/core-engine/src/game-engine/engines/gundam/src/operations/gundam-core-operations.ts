import { CoreOperation } from "~/game-engine/core-engine/engine/core-operation";
import { logger } from "~/game-engine/core-engine/utils";
import type { GundamModel } from "../cards/gundam-card-model";
import type { GundamEngine } from "../gundam-engine";
import type {
  GundamCardDefinition,
  GundamCardFilter,
  GundamCardMeta,
  GundamGameState,
  GundamPlayerState,
} from "../gundam-generic-types";

/**
 * Gundam-specific core operations extending the base CoreOperation class
 * Provides game-specific operations for card metadata and game state management
 */
export class GundamCoreOperations extends CoreOperation<
  GundamGameState,
  GundamCardDefinition,
  GundamPlayerState,
  GundamCardFilter,
  GundamCardMeta,
  GundamModel
> {
  // Type-safe reference to the Gundam engine
  protected declare engine: GundamEngine;

  /**
   * Exert a card (Gundam-specific state change)
   */
  exertCard(cardId: string): void {
    this.updateCardMeta(cardId, { isExerted: true });
  }

  /**
   * Ready a card (Gundam-specific state change)
   */
  readyCard(cardId: string): void {
    this.updateCardMeta(cardId, { isExerted: false });
  }

  /**
   * Pair a pilot with a unit
   */
  pairPilotWithUnit(pilotId: string, unitId: string): void {
    this.updateCardMeta(pilotId, { isPaired: true, pairedWith: unitId });
    this.updateCardMeta(unitId, { isPaired: true, pairedWith: pilotId });
    logger.debug(`Paired pilot ${pilotId} with unit ${unitId}`);
  }

  /**
   * Unpair a card from its paired card
   */
  unpairCard(cardId: string): void {
    const meta = this.getCardMeta(cardId);
    const pairedWith = meta.pairedWith;
    if (!pairedWith) return;

    this.updateCardMeta(cardId, { isPaired: false, pairedWith: undefined });
    this.updateCardMeta(pairedWith, { isPaired: false, pairedWith: undefined });
    logger.debug(`Unpaired ${cardId} from ${pairedWith}`);
  }

  /**
   * Apply damage to a card
   */
  applyDamage(cardId: string, damage: number): void {
    if (damage <= 0) return; // No damage to apply

    // Add damage to existing damage
    const currentDamage = this.getCardMeta(cardId).damage || 0;
    this.updateCardMeta(cardId, { damage: currentDamage + damage });

    logger.debug(
      `Applied ${damage} damage to ${cardId}, total damage: ${
        this.getCardMeta(cardId).damage
      }`,
    );
  }

  /**
   * Remove damage from a card (for healing effects)
   */
  removeDamage(cardId: string, amount: number): void {
    if (amount <= 0) return;

    const currentDamage = this.getCardMeta(cardId).damage || 0;
    this.updateCardMeta(cardId, {
      damage: Math.max(0, currentDamage - amount),
    });

    logger.debug(
      `Removed ${amount} damage from ${cardId}, remaining damage: ${
        this.getCardMeta(cardId).damage
      }`,
    );
  }

  /**
   * Mark that a unit has attacked this turn
   */
  markAttacked(cardId: string): void {
    this.updateCardMeta(cardId, { attackedThisTurn: true });
  }

  /**
   * Mark that a card's ability has been activated this turn
   */
  markAbilityActivated(cardId: string): void {
    this.updateCardMeta(cardId, { activatedThisTurn: true });
  }

  /**
   * Set a combat role for a card
   */
  setCombatRole(
    cardId: string,
    role: "attacker" | "defender" | "blocker",
  ): void {
    this.updateCardMeta(cardId, { combatRole: role });
  }

  /**
   * Clear a card's combat role
   */
  clearCombatRole(cardId: string): void {
    this.updateCardMeta(cardId, { combatRole: undefined });
  }

  /**
   * Add a modifier effect to a card
   */
  addModifier(
    cardId: string,
    modifier: { source: string; effect: string; duration?: string },
  ): void {
    const meta = this.getCardMeta(cardId);
    const modifiers = [...(meta.modifiers || []), modifier];
    this.updateCardMeta(cardId, { modifiers });
  }

  /**
   * Remove modifiers from a specific source
   */
  removeModifiersBySource(cardId: string, source: string): void {
    const meta = this.getCardMeta(cardId);
    const modifiers = (meta.modifiers || []).filter(
      (mod) => mod.source !== source,
    );
    this.updateCardMeta(cardId, { modifiers });
  }

  /**
   * Add a counter to a card
   */
  addCounter(cardId: string, counterType: string, amount = 1): void {
    const counters = this.getCardMeta(cardId).counters || {};
    counters[counterType] = (counters[counterType] || 0) + amount;
    this.updateCardMeta(cardId, { counters });
  }

  /**
   * Remove a counter from a card
   */
  removeCounter(cardId: string, counterType: string, amount = 1): void {
    const counters = this.getCardMeta(cardId).counters || {};
    if (counters[counterType]) {
      counters[counterType] = Math.max(0, counters[counterType] - amount);
      if (counters[counterType] === 0) {
        delete counters[counterType];
      }
    }
    this.updateCardMeta(cardId, { counters });
  }

  /**
   * Add a status effect to a card
   */
  addStatusEffect(cardId: string, effect: string): void {
    const meta = this.getCardMeta(cardId);
    const statusEffects = new Set(meta.statusEffects || []);
    statusEffects.add(effect);
    this.updateCardMeta(cardId, { statusEffects });
  }

  /**
   * Remove a status effect from a card
   */
  removeStatusEffect(cardId: string, effect: string): void {
    const meta = this.getCardMeta(cardId);
    const statusEffects = new Set(meta.statusEffects || []);
    statusEffects.delete(effect);
    this.updateCardMeta(cardId, { statusEffects });
  }

  /**
   * Reset turn-based state for all cards (at end of turn)
   */
  resetTurnState(playerId: string): void {
    // Find all cards belonging to the player
    const playerCards = this.getCardsInZone("battleArea", playerId).concat(
      this.getCardsInZone("resourceArea", playerId),
    );

    // Reset turn-based states for each card
    for (const card of playerCards) {
      this.updateCardMeta(card.instanceId, {
        attackedThisTurn: false,
        activatedThisTurn: false,
        playedThisTurn: false,
      });
    }
  }
}
