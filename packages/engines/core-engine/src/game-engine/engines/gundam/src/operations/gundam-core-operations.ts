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

  readyAllCards(playerId: string): void {
    const cards = this.getCardsInZone("battleArea", playerId).concat(
      this.getCardsInZone("resourceArea", playerId).concat(
        this.getCardsInZone("baseSection", playerId),
      ),
    );

    for (const card of cards) {
      this.readyCard(card.instanceId);
    }

    logger.debug(`Ready all cards for player ${playerId}`);
  }

  addResourceToResourceArea(playerId: string): void {
    const resourceDeck = this.getCardsInZone("resourceDeck", playerId);
    if (!resourceDeck.length) {
      logger.error("No resource card available to add to resource area");
      return;
    }
    const topCardInResourceDeck = resourceDeck[0];
    if (!topCardInResourceDeck) {
      logger.error("No resource card found in resource area");
      return;
    }

    this.moveCard({
      playerId,
      from: "resourceDeck",
      to: "resourceArea",
      instanceId: topCardInResourceDeck.instanceId,
      destination: "end",
    });

    logger.debug(
      `Added resource card ${topCardInResourceDeck.instanceId} to player ${playerId}'s resource area`,
    );
  }

  /**
   * Play a card from the player's hand
   * 7-5-2-2. When playing a card from the hand, follow the steps listed below.
   * 7-5-2-2-1. Reveal the card you wish to play from your hand.
   * 7-5-2-2-2. Confirm you have a sufficient number of Resources to fulfill its Lv. condition.
   * 7-5-2-2-3. Choose the number of Resources necessary to pay its cost and rest them.
   * 7-5-2-2-4. Play the card. (See 3. Card Types)
   */
  playCardFromHand(
    playerId: string,
    cardInstanceId: string,
    destinationZone: "battleArea" | "resourceArea" | "baseSection",
  ): void {
    // 7-5-2-2-1. Reveal the card you wish to play from your hand.
    const hand = this.getCardsInZone("hand", playerId);
    const cardToPlay = hand.find((card) => card.instanceId === cardInstanceId);
    if (!cardToPlay) {
      logger.error(`Card ${cardInstanceId} not found in hand`);
      return;
    }

    // 7-5-2-2-2. Confirm you have a sufficient number of Resources to fulfill its Lv. condition.
    if (!cardToPlay.hasEnoughLevel()) {
      logger.error(
        `Not enough resources to play card ${cardInstanceId} for player ${playerId}`,
      );
      return;
    }

    // 7-5-2-2-3. Choose the number of Resources necessary to pay its cost and rest them.
    const availableResources = this.getCardsInZone(
      "resourceArea",
      playerId,
    ).filter(
      (gundamModel) => !this.getCardMeta(gundamModel.instanceId).isExerted,
    );
    const requiredResources = this.getCardMeta(cardInstanceId).cost || 0;
    if (availableResources.length < requiredResources) {
      logger.error(
        `Not enough available resources to play card ${cardInstanceId} for player ${playerId}`,
      );
      return;
    }

    // Exert the required resources
    for (let i = 0; i < requiredResources; i++) {
      const resourceCard = availableResources[i];
      this.exertCard(resourceCard.instanceId);
      logger.debug(
        `Exerted resource card ${resourceCard.instanceId} for player ${playerId}`,
      );
    }

    this.moveCard({
      playerId,
      from: "hand",
      to: destinationZone,
      instanceId: cardInstanceId,
      destination: "end",
    });

    logger.debug(
      `Played card ${cardInstanceId} from hand to ${destinationZone} for player ${playerId}`,
    );
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
   * Pair a pilot with a unit
   */
  deployUnit(cardInstanceId: string): void {}

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

  /**
   * Draw Card Operation - Implementation of Rule 6-3-1
   * The active player draws one card from their deck and adds it to their hand.
   * If they draw a card and their deck then has no cards in it, they immediately lose the game.
   */
  drawCard(playerId: string) {
    const deck = this.getZone("deck", playerId);

    if (deck.cards.length === 0) {
      // If the deck is empty, the player loses the game
      this.state.G.winner = Object.keys(this.state.G.players).find(
        (id) => id !== playerId,
      );
      return;
    }

    this.moveCard({
      playerId,
      from: "deck",
      to: "hand",
      destination: "end",
    });
  }
}
