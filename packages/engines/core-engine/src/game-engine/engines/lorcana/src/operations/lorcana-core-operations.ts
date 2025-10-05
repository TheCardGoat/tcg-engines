import { CoreOperation } from "~/game-engine/core-engine/engine/core-operation";
import { logger } from "~/game-engine/core-engine/utils";
import {
  Ability,
  type LayerItem,
  type LorcanaAbility,
  type TriggerTiming,
} from "~/game-engine/engines/lorcana/src/abilities/ability-types";
import { shouldAutoResolveLayer } from "~/game-engine/engines/lorcana/src/abilities/should-auto-resolve-layer";
import type { LorcanaCard } from "~/game-engine/engines/lorcana/src/cards/lorcana-game-card";
import { addAbilitiesToResolve } from "~/game-engine/engines/lorcana/src/operations/modules/add-abilities-to-resolve";
import type { LorcanaCardInstance } from "../cards/lorcana-card-instance";
import type { LorcanaCardDefinition, LorcanaEngine } from "../lorcana-engine";
import type {
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
  resolveLayerItem as resolveBagTriggerImpl,
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
    this.updateCardMeta(cardId, { exerted: true });
  }

  /**
   * Ready a card (Lorcana-specific state change)
   */
  readyCard(cardId: string): void {
    this.updateCardMeta(cardId, { exerted: false });
  }

  /**
   * Apply damage to a character or location (Lorcana-specific damage system)
   * Damage accumulates on the card until it's banished or healed
   */
  applyDamage(
    cardId: string,
    damage: number,
    source?: "challenges" | "abilities" | "spells" | "all",
  ): void {
    if (damage <= 0) return; // No damage to apply

    // Check for damage immunity
    const meta = this.getCardMeta(cardId);
    if (meta.damageImmunities && Array.isArray(meta.damageImmunities)) {
      const hasImmunity = meta.damageImmunities.some((immunity: any) => {
        if (!immunity.sources || immunity.sources.length === 0) {
          return true; // Immunity with no sources means immune to all
        }
        return (
          immunity.sources.includes(source) || immunity.sources.includes("all")
        );
      });

      if (hasImmunity) {
        logger.debug(
          `${cardId} is immune to damage from ${source || "unknown source"}`,
        );
        return; // Don't apply damage if immune
      }
    }

    // Add damage to existing damage (damage accumulates)
    const currentDamage = meta.damage || 0;
    this.updateCardMeta(cardId, { damage: currentDamage + damage });

    logger.debug(
      `Applied ${damage} damage to ${cardId} from ${source || "unknown source"}, total damage: ${this.getCardMeta(cardId).damage}`,
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
    this.updateCardMeta(cardId, {
      damage: Math.max(0, currentDamage - amount),
    });

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

  addAbilitiesToResolve(source: LorcanaCard) {
    if (!source) {
      logger.error("Cannot add abilities to resolve: source is undefined");
      return;
    }

    addAbilitiesToResolve.call(this, source);
  }

  resolveLayer(layer?: LayerItem): void {
    if (!layer) {
      logger.error("Cannot resolve layer: layer is undefined");
      return;
    }

    resolveBagTriggerImpl.call(this, layer);
  }

  removeLayer(layer: LayerItem, type: "trigger" | "non-trigger"): void {
    if (!layer) {
      logger.error("Cannot remove layer: layer is undefined");
      return;
    }

    if (type === "trigger") {
      // Remove from the bag if it's a trigger layer
      const index = this.state.G.bag.findIndex((l) => l.id === layer.id);
      if (index !== -1) {
        this.state.G.bag.splice(index, 1);
        logger.debug(`Removed trigger layer ${layer.id} from the bag`);
      } else {
        logger.warn(`Trigger layer ${layer.id} not found in the bag`);
      }
    }

    if (type === "non-trigger") {
      // Remove from effects if it's a non-trigger layer
      const index = this.state.G.effects.findIndex((l) => l.id === layer.id);
      if (index !== -1) {
        this.state.G.effects.splice(index, 1);
        logger.debug(`Removed non-trigger layer ${layer.id} from effects`);
      } else {
        logger.warn(`Non-trigger layer ${layer.id} not found in effects`);
      }
    }
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

  canAddAbilityToResolve(ability: LorcanaAbility, source: LorcanaCard) {
    // Check conditions for adding abilities

    // Skip singer abilities - they should only be added when the card is sung, not played
    if (
      ability.type === "keyword" &&
      ((ability as any).keyword === "sing-together" ||
        (ability as any).keyword === "sing")
    ) {
      logger.debug(
        `Skipping singer ability for ${source.name} (should only execute when sung)`,
      );
      return false;
    }

    // check if there's valid targets for the abilities

    return true;
  }

  addAbilityToResolve(ability: LorcanaAbility, source: LorcanaCard) {
    const responder = source.ownerId;
    const layerItem: LayerItem = {
      id: `${this.state.G.effects.length}_${responder}_${source.instanceId}_${source.publicId}`,
      sourceCardId: source.instanceId,
      controllerId: responder,
      ability: ability,
    };
    this.state.G.effects.push(layerItem);

    if (shouldAutoResolveLayer(layerItem)) {
      // If the layer should auto-resolve, we can resolve it immediately
      this.resolveLayer(layerItem);
      this.removeLayer(layerItem, "non-trigger");
    }
  }

  /**
   * Resolve card targets based on target definitions
   * This implements the targeting system for effects
   */
  resolveTargets(targetDefs: any[], sourceCard?: LorcanaCard): LorcanaCard[] {
    const targets: LorcanaCard[] = [];

    for (const targetDef of targetDefs) {
      if (!targetDef || targetDef.type !== "card") {
        continue;
      }

      const cardTarget = targetDef;

      // Get the zone to search in (defaults to "play")
      const zone = cardTarget.zone || "play";

      // Determine the owner filter
      let ownerFilter: string | undefined;
      if (cardTarget.owner === "self" && sourceCard) {
        ownerFilter = sourceCard.ownerId;
      } else if (cardTarget.owner === "opponent" && sourceCard) {
        // Find opponent of the source card owner
        const allPlayers = Object.keys(this.state.ctx.players);
        ownerFilter = allPlayers.find((p) => p !== sourceCard.ownerId);
      }

      // Get all cards in the zone
      const cardsInZone = this.getAllCardsInZone(zone, ownerFilter);
      logger.debug(
        `resolveTargets: Got ${cardsInZone.length} cards from getAllCardsInZone`,
      );

      // Filter by card type if specified
      let filteredCards = cardsInZone;
      if (cardTarget.cardType) {
        const cardTypes = Array.isArray(cardTarget.cardType)
          ? cardTarget.cardType
          : [cardTarget.cardType];
        logger.debug(
          `resolveTargets: Filtering by cardTypes: ${cardTypes.join(", ")}`,
        );
        filteredCards = filteredCards.filter((card: any) => {
          const hasCard = !!card;
          const hasDef = card && !!card.definition;
          const hasType = card && card.type;
          // Card might have .type directly instead of .definition.type
          const cardType = card?.definition?.type || card?.type;
          const matches = cardType && cardTypes.includes(cardType);
          logger.debug(
            `Filter check: hasCard=${hasCard}, hasDef=${hasDef}, cardType=${cardType}, matches=${matches}, cardKeys=${card ? Object.keys(card).join(",") : "none"}`,
          );
          return matches;
        });
        logger.debug(
          `resolveTargets: After filtering: ${filteredCards.length} cards`,
        );
      }

      // Filter by card name if specified
      if (cardTarget.withName) {
        logger.debug(
          `resolveTargets: Filtering by withName: ${cardTarget.withName}`,
        );
        filteredCards = filteredCards.filter((card: any) => {
          const cardName =
            card?.name || card?.definition?.name || card?.card?.name;
          const matches = cardName === cardTarget.withName;
          logger.debug(
            `Name filter check: cardName="${cardName}", targetName="${cardTarget.withName}", matches=${matches}`,
          );
          return matches;
        });
        logger.debug(
          `resolveTargets: After name filtering: ${filteredCards.length} cards`,
        );
      }

      // For now, take the first N cards based on count (or all if targetAll)
      if (cardTarget.targetAll) {
        targets.push(...filteredCards);
      } else {
        // Handle "up to" targeting - if max is specified, take up to max cards
        // Otherwise use count (defaulting to 1)
        const maxCount = cardTarget.max;
        if (maxCount !== undefined) {
          targets.push(...filteredCards.slice(0, maxCount));
        } else {
          const count = cardTarget.count || 1;
          targets.push(...filteredCards.slice(0, count));
        }
      }
    }

    return targets;
  }

  /**
   * Get all cards in a specific zone, optionally filtered by owner
   */
  getAllCardsInZone(zone: string, ownerFilter?: string): LorcanaCard[] {
    const cards: LorcanaCard[] = [];

    for (const playerId of Object.keys(this.state.ctx.players)) {
      // Skip if we have an owner filter and this player doesn't match
      if (ownerFilter && playerId !== ownerFilter) {
        continue;
      }

      const zoneName = `${playerId}-${zone}`;
      const zoneData = this.getZone(zoneName, playerId);

      logger.debug(
        `getAllCardsInZone: zone=${zoneName}, hasData=${!!zoneData}, cardCount=${zoneData?.cards?.length || 0}`,
      );

      if (zoneData && zoneData.cards) {
        for (const instanceId of zoneData.cards) {
          const card =
            this.engine.cardInstanceStore.getCardByInstanceId(instanceId);
          if (card) {
            cards.push(card);
            logger.debug(
              `Found card in ${zoneName}: ${card.name} (${card.instanceId})`,
            );
          }
        }
      }
    }

    logger.debug(
      `getAllCardsInZone total: ${cards.length} cards found in zone ${zone}`,
    );
    return cards;
  }
}
