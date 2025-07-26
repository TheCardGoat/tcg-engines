import type { CoreCardInstance } from "~/game-engine/core-engine/card/core-card-instance";
import { CoreOperation } from "~/game-engine/core-engine/engine/core-operation";
import type { CoreEngineState } from "~/game-engine/core-engine/game-configuration";
import type { AlphaClashEngine } from "~/game-engine/engines/alpha-clash/alpha-clash-engine";
import type {
  AlphaClashCardDefinition,
  AlphaClashCardFilter,
  AlphaClashCardMeta,
  AlphaClashCardStatus,
  AlphaClashDamageType,
  AlphaClashGameState,
  AlphaClashPlayerState,
} from "~/game-engine/engines/alpha-clash/alpha-clash-engine-types";
import { logger } from "~/shared/logger";

// Define card instance type for Alpha Clash
type AlphaClashCardInstance = CoreCardInstance<AlphaClashCardDefinition>;

/**
 * Core operations for Alpha Clash game
 * Extends the CoreOperation class with Alpha Clash-specific operations
 */
export class AlphaClashCoreOperations extends CoreOperation<
  AlphaClashGameState,
  AlphaClashCardDefinition,
  AlphaClashPlayerState,
  AlphaClashCardFilter,
  AlphaClashCardMeta,
  AlphaClashCardInstance
> {
  private alphaClashEngine: AlphaClashEngine;

  constructor({
    state,
    engine,
  }: {
    state: CoreEngineState<AlphaClashGameState>;
    engine: AlphaClashEngine;
  }) {
    super({ state, engine });
    this.alphaClashEngine = engine;
  }

  /**
   * Set the status of a card (ready, engaged, face-up, face-down)
   */
  setCardStatus(instanceId: string, status: AlphaClashCardStatus): void {
    this.updateCardMeta(instanceId, { status });
    logger.debug(`Set ${instanceId} status to ${status}`);
  }

  /**
   * Apply damage to a card
   * @param instanceId The instance ID of the card
   * @param damage The amount of damage to apply
   * @param damageType The type of damage (clash, non-clash)
   */
  applyDamage(
    instanceId: string,
    damage: number,
    damageType: AlphaClashDamageType = "clash",
  ): void {
    if (damage <= 0) return;

    // Add damage to existing damage
    const currentDamage = this.getCardMeta(instanceId).damage || 0;
    this.updateCardMeta(instanceId, {
      damage: currentDamage + damage,
      damageType,
    });

    logger.debug(
      `Applied ${damage} ${damageType} damage to ${instanceId}, total damage: ${
        currentDamage + damage
      }`,
    );
  }

  /**
   * Remove damage from a card
   */
  removeDamage(instanceId: string, amount: number): void {
    if (amount <= 0) return;

    const currentDamage = this.getCardMeta(instanceId).damage || 0;
    if (currentDamage <= 0) return;

    const newDamage = Math.max(0, currentDamage - amount);
    this.updateCardMeta(instanceId, { damage: newDamage });

    logger.debug(
      `Removed ${amount} damage from ${instanceId}, remaining damage: ${newDamage}`,
    );
  }

  /**
   * Clear all damage from a card
   */
  clearDamage(instanceId: string): void {
    this.updateCardMeta(instanceId, { damage: 0 });
    logger.debug(`Cleared all damage from ${instanceId}`);
  }

  /**
   * Add a counter to a card
   */
  addCounter(instanceId: string, counterType: string, amount = 1): void {
    const counters = this.getCardMeta(instanceId).counters || {};
    counters[counterType] = (counters[counterType] || 0) + amount;

    this.updateCardMeta(instanceId, { counters });
    logger.debug(`Added ${amount} ${counterType} counter(s) to ${instanceId}`);
  }

  /**
   * Remove a counter from a card
   */
  removeCounter(instanceId: string, counterType: string, amount = 1): void {
    const counters = this.getCardMeta(instanceId).counters || {};

    if (counters[counterType]) {
      counters[counterType] = Math.max(0, counters[counterType] - amount);
      if (counters[counterType] === 0) {
        delete counters[counterType];
      }

      this.updateCardMeta(instanceId, { counters });
      logger.debug(
        `Removed ${amount} ${counterType} counter(s) from ${instanceId}`,
      );
    }
  }

  /**
   * Add a modifier to a card
   */
  addModifier(
    instanceId: string,
    source: string,
    effect: string,
    duration?: string,
  ): void {
    const modifiers = [...(this.getCardMeta(instanceId).modifiers || [])];
    modifiers.push({ source, effect, duration });

    this.updateCardMeta(instanceId, { modifiers });
    logger.debug(`Added modifier to ${instanceId}: ${effect} from ${source}`);
  }

  /**
   * Remove modifiers from a specific source
   */
  removeModifiersBySource(instanceId: string, source: string): void {
    const meta = this.getCardMeta(instanceId);
    if (!meta.modifiers || meta.modifiers.length === 0) return;

    const modifiers = meta.modifiers.filter((mod) => mod.source !== source);
    this.updateCardMeta(instanceId, { modifiers });

    logger.debug(`Removed modifiers from ${source} on ${instanceId}`);
  }

  /**
   * Attach a card to another card
   */
  attachCard(attachmentId: string, targetId: string): void {
    // Update the attachment's metadata
    this.updateCardMeta(attachmentId, { attachedTo: targetId });

    // Update the target's metadata
    const targetMeta = this.getCardMeta(targetId);
    const attachments = [...(targetMeta.attachments || [])];

    if (!attachments.includes(attachmentId)) {
      attachments.push(attachmentId);
      this.updateCardMeta(targetId, { attachments });
    }

    logger.debug(`Attached ${attachmentId} to ${targetId}`);
  }

  /**
   * Detach a card from its target
   */
  detachCard(attachmentId: string): void {
    const meta = this.getCardMeta(attachmentId);
    const targetId = meta.attachedTo;

    if (!targetId) return;

    // Remove the attachment relationship
    this.updateCardMeta(attachmentId, { attachedTo: undefined });

    // Update the target's attachments list
    const targetMeta = this.getCardMeta(targetId);
    if (targetMeta.attachments) {
      const attachments = targetMeta.attachments.filter(
        (id) => id !== attachmentId,
      );
      this.updateCardMeta(targetId, { attachments });
    }

    logger.debug(`Detached ${attachmentId} from ${targetId}`);
  }

  /**
   * Mark a card as having been played this turn
   */
  markAsPlayed(instanceId: string): void {
    this.updateCardMeta(instanceId, { playedThisTurn: true });
  }

  /**
   * Mark a card as having activated an ability this turn
   */
  markAsActivated(instanceId: string): void {
    this.updateCardMeta(instanceId, { activatedThisTurn: true });
  }

  /**
   * Mark a card as having attacked this turn
   */
  markAsAttacked(instanceId: string): void {
    this.updateCardMeta(instanceId, { attackedThisTurn: true });
  }

  /**
   * Reset turn-based flags for all cards
   */
  resetTurnFlags(playerId: string): void {
    // Get all cards controlled by the player
    const playerCards = this.alphaClashEngine.getCardsByFilter({
      controller: playerId,
    });

    // Reset the turn flags for each card
    for (const card of playerCards) {
      this.updateCardMeta(card.instanceId, {
        playedThisTurn: false,
        activatedThisTurn: false,
        attackedThisTurn: false,
      });
    }

    logger.debug(`Reset turn flags for all cards controlled by ${playerId}`);
  }

  /**
   * Set a card as the active clashground
   */
  setActiveClashground(instanceId: string): void {
    // Find any currently active clashground and deactivate it
    const meta = this.getCardMetas();
    for (const [id, cardMeta] of Object.entries(meta)) {
      if (cardMeta.isActive && id !== instanceId) {
        this.updateCardMeta(id, { isActive: false });
      }
    }

    // Set the new clashground as active
    this.updateCardMeta(instanceId, { isActive: true });
    logger.debug(`Set ${instanceId} as the active clashground`);
  }
}
