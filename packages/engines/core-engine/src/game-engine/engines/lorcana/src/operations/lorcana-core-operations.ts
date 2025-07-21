import { CoreOperation } from "~/game-engine/core-engine/engine/core-operation";
import type { LorcanaCardInstance } from "../cards/lorcana-card-instance";
import type { LorcanaEngine } from "../lorcana-engine";
import type { LorcanaGameState } from "../lorcana-engine-types";
import type {
  LorcanaCardDefinition,
  LorcanaCardFilter,
  LorcanaPlayerState,
} from "../lorcana-generic-types";

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
    const attacker = this.getCardInstance(attackerId);
    const defender = this.getCardInstance(defenderId);

    // Get Lorcana-specific properties
    const attackerStrength = attacker.card.strength || 0;
    const attackerWillpower = attacker.card.willpower || 0;
    const defenderStrength = defender.card.strength || 0;
    const defenderWillpower = defender.card.willpower || 0;

    // Apply damage (Lorcana-specific rules)
    if (attackerStrength >= defenderWillpower) {
      // Defender is banished
      const defenderOwner = this.getCardOwner(defenderId);
      if (defenderOwner) {
        this.moveCard({
          playerId: defenderOwner,
          instanceId: defenderId,
          to: "discard",
        });
      }
    }

    if (defenderStrength >= attackerWillpower) {
      // Attacker is banished
      const attackerOwner = this.getCardOwner(attackerId);
      if (attackerOwner) {
        this.moveCard({
          playerId: attackerOwner,
          instanceId: attackerId,
          to: "discard",
        });
      }
    }

    // Both characters become exerted (update meta)
    this.exertCard(attackerId);
    this.exertCard(defenderId);
  }

  /**
   * Quest with a character
   * Implements Lorcana-specific questing mechanics
   */
  questWithCharacter(characterId: string): void {
    const character = this.getCardInstance(characterId);
    const lore = character.card.lore || 0;

    // Add lore to player's total (stored in ctx.players)
    const playerId = this.getCardOwner(characterId);
    if (playerId && this.state.ctx.players[playerId]) {
      const playerState = this.state.ctx.players[
        playerId
      ] as LorcanaPlayerState;
      playerState.lore += lore;
    }

    // Exert the character (update meta)
    this.exertCard(characterId);
  }

  gameStateCheck(): void {
    const playerIds = Object.keys(this.state.ctx.players);
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
    const character = this.getCardInstance(characterId);

    // Character must be in play and not exerted
    const zone = this.getCardZone(characterId);
    if (zone !== "play") return false;

    // Check if character is exerted (Lorcana-specific state)
    if (character.isExerted) return false;

    // Check if character has Rush or has been in play for a turn
    if (character.card.abilities?.some((ability) => ability.name === "Rush")) {
      return true;
    }

    // Additional Lorcana-specific quest conditions can be added here
    return true;
  }

  /**
   * Check if a character can challenge (Lorcana-specific rules)
   */
  canCharacterChallenge(characterId: string): boolean {
    const character = this.getCardInstance(characterId);

    // Character must be in play and not exerted
    const zone = this.getCardZone(characterId);
    if (zone !== "play") return false;

    // Check if character is exerted
    if (character.isExerted) return false;

    // Character must have strength to challenge
    return (character.card.strength || 0) > 0;
  }

  /**
   * Ready all characters for a player (start of turn in Lorcana)
   */
  readyAllCharacters(playerId: string): void {
    const charactersInPlay = this.getCardsInZone("play", playerId);

    for (const character of charactersInPlay) {
      this.readyCard(character.instanceId);
    }
  }

  /**
   * Ready all ink cards for a player (start of turn in Lorcana)
   */
  readyAllInk(playerId: string): void {
    const inkCards = this.getCardsInZone("inkwell", playerId);

    for (const inkCard of inkCards) {
      this.readyCard(inkCard.instanceId);
    }
  }

  /**
   * Make a character leave its current location (Lorcana-specific mechanic)
   */
  leaveLocation(char: LorcanaCardInstance): void {
    const location = char.location;
    if (!location) {
      return;
    }

    // Update character metadata to remove location reference
    if (this.state.G.metas[char.instanceId]) {
      this.state.G.metas[char.instanceId].location = undefined;
    }

    // Update location metadata to remove character from characters array
    if (this.state.G.metas[location.instanceId]?.characters) {
      this.state.G.metas[location.instanceId].characters = this.state.G.metas[
        location.instanceId
      ].characters.filter((card) => card !== char.instanceId);
    }
  }

  /**
   * Make a character enter a location (Lorcana-specific mechanic)
   */
  enterLocation(
    char: LorcanaCardInstance,
    location: LorcanaCardInstance,
  ): void {
    const characterInstanceId = char.instanceId;
    const locationInstanceId = location.instanceId;

    // First leave current location if any
    this.leaveLocation(char);

    // Track character-location relationship by setting character's location metadata
    if (!this.state.G.metas[characterInstanceId]) {
      this.state.G.metas[characterInstanceId] = {};
    }
    this.state.G.metas[characterInstanceId].location = locationInstanceId;

    // Track characters at location by adding to location's characters array
    if (!this.state.G.metas[locationInstanceId]) {
      this.state.G.metas[locationInstanceId] = {};
    }
    // Always initialize as array for locations
    if (!Array.isArray(this.state.G.metas[locationInstanceId].characters)) {
      this.state.G.metas[locationInstanceId].characters = [];
    }
    const currentCharactersAtLocation =
      this.state.G.metas[locationInstanceId].characters;
    if (!currentCharactersAtLocation.includes(characterInstanceId)) {
      currentCharactersAtLocation.push(characterInstanceId);
    }

    // Add triggered effects to the bag (rule 4.3.7.5)
    this.addTriggeredEffectsToTheBag("onMove", characterInstanceId);
  }

  /**
   * Get the number of available (ready) ink cards for a player
   * This is used for cost validation
   */
  getAvailableInk(playerId: string): number {
    // Get only ready (non-exerted) ink cards for the player
    const readyInkCards = this.getCardsInZone("inkwell", playerId).filter(
      (card) => !this.state.G.metas[card.instanceId]?.exerted,
    );

    return readyInkCards.length;
  }

  /**
   * Exert ink cards to pay for costs
   * This is a Lorcana-specific mechanism for paying costs with ink
   */
  exertInkForCost(playerId: string, cost: number): boolean {
    if (cost <= 0) {
      return true;
    }

    // Get only ready (non-exerted) ink cards for the player
    const readyInkCards = this.getCardsInZone("inkwell", playerId).filter(
      (card) => !this.state.G.metas[card.instanceId]?.exerted,
    );

    if (readyInkCards.length < cost) {
      return false;
    }

    for (let i = 0; i < cost; i++) {
      const inkCard = readyInkCards[i];
      if (inkCard) {
        this.exertCard(inkCard.instanceId);
      }
    }

    return true;
  }

  /**
   * Add triggered effects to the bag for processing
   * This is a Lorcana-specific mechanism for handling card triggers
   */
  addTriggeredEffectsToTheBag(timing: string, cardInstanceId: string): void {
    const card = this.getCardInstance(cardInstanceId);
    if (!card) return;

    const locationId = this.state.G.metas[cardInstanceId]?.location;

    // Ensure triggerEvents is initialized
    if (!this.state.G.triggerEvents) {
      this.state.G.triggerEvents = [];
    }

    // Handle move-related triggers
    if (timing === "onMove" && locationId) {
      const location = this.getCardInstance(locationId);

      if (location) {
        // For the location
        this.state.G.triggerEvents.push({
          type: "locationTrigger",
          timing,
          locationId,
          characterId: cardInstanceId,
          timestamp: Date.now(),
        });

        // For the character
        this.state.G.triggerEvents.push({
          type: "characterTrigger",
          timing,
          locationId,
          characterId: cardInstanceId,
          timestamp: Date.now(),
        });
      }
    } else if (timing === "onPutIntoInkwell") {
      // Handle inkwell-related triggers
      this.state.G.triggerEvents.push({
        type: "inkwellTrigger",
        timing,
        characterId: cardInstanceId,
        timestamp: Date.now(),
      });
    }
  }
}
