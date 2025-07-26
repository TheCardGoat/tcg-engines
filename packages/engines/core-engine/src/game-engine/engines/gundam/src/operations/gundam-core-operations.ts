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
   * Exert a Unit card (Gundam-specific state change)
   */
  exertCard(cardId: string): void {
    this.updateCardMeta(cardId, "isExerted", true);
    logger.debug(`Exerted card ${cardId}`);
  }

  /**
   * Ready a card (un-exert it)
   */
  readyCard(cardId: string): void {
    this.updateCardMeta(cardId, "isExerted", false);
    logger.debug(`Readied card ${cardId}`);
  }

  /**
   * Pair a Pilot with a Unit
   */
  pairCards(pilotId: string, unitId: string): void {
    this.updateCardMeta(pilotId, "isPaired", true);
    this.updateCardMeta(pilotId, "pairedWith", unitId);
    this.updateCardMeta(unitId, "isPaired", true);
    this.updateCardMeta(unitId, "pairedWith", pilotId);
    logger.debug(`Paired pilot ${pilotId} with unit ${unitId}`);
  }

  /**
   * Unpair cards (when one leaves play or pairing is broken)
   */
  unpairCards(cardId: string): void {
    const meta = this.getCardMeta(cardId);
    const pairedWith = meta.pairedWith;

    if (pairedWith) {
      // Unpair both cards
      this.updateCardMeta(cardId, "isPaired", false);
      this.updateCardMeta(cardId, "pairedWith", undefined);
      this.updateCardMeta(pairedWith, "isPaired", false);
      this.updateCardMeta(pairedWith, "pairedWith", undefined);
      logger.debug(`Unpaired cards ${cardId} and ${pairedWith}`);
    }
  }

  /**
   * Apply damage to a Unit
   */
  applyDamage(cardId: string, damage: number): void {
    if (damage <= 0) return;

    const currentDamage = this.getCardMeta(cardId).damage || 0;
    this.updateCardMeta(cardId, "damage", currentDamage + damage);

    logger.debug(
      `Applied ${damage} damage to ${cardId}, total damage: ${this.getCardMeta(cardId).damage}`,
    );
  }

  /**
   * Heal damage from a Unit (for Repair effects)
   */
  healDamage(cardId: string, amount: number): void {
    if (amount <= 0) return;

    const currentDamage = this.getCardMeta(cardId).damage || 0;
    this.updateCardMeta(cardId, "damage", Math.max(0, currentDamage - amount));

    logger.debug(
      `Healed ${amount} damage from ${cardId}, remaining damage: ${this.getCardMeta(cardId).damage}`,
    );
  }

  /**
   * Get current damage on a card
   */
  getDamage(cardId: string): number {
    return this.getCardMeta(cardId).damage || 0;
  }

  /**
   * Mark a card as having attacked this turn
   */
  markAsAttacked(cardId: string): void {
    this.updateCardMeta(cardId, "attackedThisTurn", true);
    logger.debug(`Marked ${cardId} as having attacked this turn`);
  }

  /**
   * Mark a card as activated this turn
   */
  markAsActivated(cardId: string): void {
    this.updateCardMeta(cardId, "activatedThisTurn", true);
    logger.debug(`Marked ${cardId} as activated this turn`);
  }

  /**
   * Set a card's combat role
   */
  setCombatRole(
    cardId: string,
    role: "attacker" | "defender" | "blocker",
  ): void {
    this.updateCardMeta(cardId, "combatRole", role);
    logger.debug(`Set ${cardId} combat role to ${role}`);
  }

  /**
   * Clear combat role (end of combat)
   */
  clearCombatRole(cardId: string): void {
    this.updateCardMeta(cardId, "combatRole", undefined);
  }

  /**
   * Add a modifier effect to a card
   */
  addModifier(
    cardId: string,
    modifier: { source: string; effect: string; duration?: string },
  ): void {
    const meta = this.getCardMeta(cardId);
    const modifiers = [...meta.modifiers, modifier];
    this.updateCardMeta(cardId, "modifiers", modifiers);
    logger.debug(`Added modifier to ${cardId}: ${modifier.effect}`);
  }

  /**
   * Remove modifiers from a specific source
   */
  removeModifiersBySource(cardId: string, source: string): void {
    const meta = this.getCardMeta(cardId);
    const modifiers = meta.modifiers.filter((mod) => mod.source !== source);
    this.updateCardMeta(cardId, "modifiers", modifiers);
    logger.debug(`Removed modifiers from ${source} on ${cardId}`);
  }

  /**
   * Add/update a counter on a card
   */
  addCounter(cardId: string, counterType: string, amount = 1): void {
    const meta = this.getCardMeta(cardId);
    const counters = { ...meta.counters };
    counters[counterType] = (counters[counterType] || 0) + amount;
    this.updateCardMeta(cardId, "counters", counters);
    logger.debug(`Added ${amount} ${counterType} counter(s) to ${cardId}`);
  }

  /**
   * Remove counters from a card
   */
  removeCounter(cardId: string, counterType: string, amount = 1): void {
    const meta = this.getCardMeta(cardId);
    const counters = { ...meta.counters };
    if (counters[counterType]) {
      counters[counterType] = Math.max(0, counters[counterType] - amount);
      if (counters[counterType] === 0) {
        delete counters[counterType];
      }
    }
    this.updateCardMeta(cardId, "counters", counters);
    logger.debug(`Removed ${amount} ${counterType} counter(s) from ${cardId}`);
  }

  /**
   * Add a status effect to a card
   */
  addStatusEffect(cardId: string, effect: string): void {
    const meta = this.getCardMeta(cardId);
    const statusEffects = new Set(meta.statusEffects);
    statusEffects.add(effect);
    this.updateCardMeta(cardId, "statusEffects", statusEffects);
    logger.debug(`Added status effect ${effect} to ${cardId}`);
  }

  /**
   * Remove a status effect from a card
   */
  removeStatusEffect(cardId: string, effect: string): void {
    const meta = this.getCardMeta(cardId);
    const statusEffects = new Set(meta.statusEffects);
    statusEffects.delete(effect);
    this.updateCardMeta(cardId, "statusEffects", statusEffects);
    logger.debug(`Removed status effect ${effect} from ${cardId}`);
  }

  /**
   * Clear all turn-based metadata (called at end of turn)
   */
  clearTurnBasedMetadata(playerId: string): void {
    const playerCards = this.getCardsInZone("battleArea", playerId).concat(
      this.getCardsInZone("resourceArea", playerId),
    );

    for (const card of playerCards) {
      this.updateCardMeta(card.instanceId, "attackedThisTurn", false);
      this.updateCardMeta(card.instanceId, "activatedThisTurn", false);
      this.updateCardMeta(card.instanceId, "playedThisTurn", false);
    }

    logger.debug(`Cleared turn-based metadata for player ${playerId}`);
  }

  /**
   * Ready all cards for a player (at start of turn)
   */
  readyAllCards(playerId: string): void {
    const playerCards = this.getCardsInZone("battleArea", playerId).concat(
      this.getCardsInZone("resourceArea", playerId),
    );

    for (const card of playerCards) {
      this.readyCard(card.instanceId);
    }

    logger.debug(`Readied all cards for player ${playerId}`);
  }
}
