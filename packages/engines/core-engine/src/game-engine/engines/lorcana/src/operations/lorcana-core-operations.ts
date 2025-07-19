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

  /**
   * Play a card from inkwell (Lorcana-specific mechanic)
   */
  playFromInkwell(cardId: string, playerId: string): void {
    // Use the engine's built-in ink management
    const inkCost = this.getInkCost(cardId);

    if (this.lorcanaEngine.exertInkForCost(playerId, inkCost)) {
      this.moveCard({
        playerId,
        instanceId: cardId,
        from: "inkwell",
        to: "play",
      });
    }
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
    // Update meta in the game state
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
}
