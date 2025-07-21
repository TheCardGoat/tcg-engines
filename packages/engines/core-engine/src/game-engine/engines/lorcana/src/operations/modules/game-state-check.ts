import { logger } from "~/shared/logger";
import type {
  LorcanaCardFilter,
  LorcanaPlayerState,
} from "../../lorcana-generic-types";
import type { LorcanaCoreOperations } from "../lorcana-core-operations";

// **1.9. Game State Check**
//
// **1.9.1.   **There is a set of conditions the game checks for with certain required actions happening when one or more of those conditions is met. This is cal ed a game state check and is made up of two parts: the game state condition and the required action. A game state condition is a specific circumstance the game state can achieve. A required action is what happens in the game when a game state condition is met. The fol owing are the conditions that the game state check looks for and the required action each creates.
// **1.9.1.1. **If a player has 20 or more lore, that player wins the game.
// **1.9.1.2. **If a player attempted to draw from a deck with no cards since the last game state check, that player loses the game.
// **1.9.1.3. **If a character or location has damage equal to or greater than its Wil power \{W\}, that character or location is banished.
// **1.9.2.   **A game state check is made at the end of every step, after any action or ability is finished resolving, and after each effect in the bag is finished resolving. During a game state check, first check and complete all win and loss conditions and required actions. Then if there are no win or loss conditions met, check and complete all other conditions and required actions. Once all required actions are complete, the game state check repeats until there are no further required actions to complete. Triggered abilities that occurred during this process are then added to the bag to resolve.
// **1.9.2.1. **Any required actions generated from a game state check happen in turn order. If a player would win and lose the game at the same time as a result of the same game state check, that player wins the game.
// **1.9.3.   **Once a required action is completed, the game state check occurs again.
// **1.9.4.   **Abilities that trigger as a result of a game state check are added to the bag as soon as the check and any required actions are fully completed.
// **1.9.5.   **If multiple required actions would happen at once, a single combined required action takes place, and all of the required actions happen simultaneously.
export function gameStateCheck(this: LorcanaCoreOperations): void {
  logger.debug("Game state check");
  let hasRequiredActions = true;
  let loopCounter = 0;
  const maxLoops = 100; // Prevent infinite loops

  // Keep checking until no more required actions are needed
  while (hasRequiredActions && loopCounter < maxLoops) {
    hasRequiredActions = false;
    loopCounter++;

    const playerIds = Object.keys(this.state.ctx.players);

    // 1.9.1.1. Check for win condition: If a player has 20 or more lore, that player wins
    for (const playerId of playerIds) {
      const playerState = this.state.ctx.players[playerId];
      if (playerState && "lore" in playerState && playerState.lore >= 20) {
        handlePlayerWin.call(this, playerId, "lore");
        return; // Game ends immediately
      }
    }

    // 1.9.1.2. Check for loss condition: If a player attempted to draw from empty deck
    // Note: This would need to be tracked when drawing cards - placeholder for now
    for (const playerId of playerIds) {
      const deck = this.getCardsInZone("deck", playerId);
      // This check would be implemented when draw mechanics are added
      // For now, we skip this check as the property doesn't exist in LorcanaPlayerState yet
    }

    // 1.9.1.3. Check for banishment: Characters/locations with damage >= willpower
    // Query characters and locations separately since we need both types
    const characterFilter: LorcanaCardFilter = {
      zone: "play",
      cardType: "character",
    };
    const locationFilter: LorcanaCardFilter = {
      zone: "play",
      cardType: "location",
    };

    const characters = this.queryCards(characterFilter);
    const locations = this.queryCards(locationFilter);
    const allCards = [...characters, ...locations];

    for (const card of allCards) {
      const damage = this.state.G.metas[card.instanceId]?.damage || 0;
      const willpower = card.card.willpower || 0;

      if (damage >= willpower && willpower > 0) {
        logger.debug(
          `Banishment: ${card.instanceId} has damage ${damage} >= willpower ${willpower}`,
        );
        // Character or location is banished
        const ownerId = this.getCardOwner(card.instanceId);
        if (ownerId) {
          this.moveCard({
            playerId: ownerId,
            instanceId: card.instanceId,
            to: "discard",
          });
          hasRequiredActions = true;
        }
      }
    }
  }

  // Log a warning if we hit the loop limit
  if (loopCounter >= maxLoops) {
    logger.warn(
      `Game state check hit maximum loop limit (${maxLoops}), stopping to prevent infinite loop`,
    );
  }
}

/**
 * Handle player win and store the win cause
 */
function handlePlayerWin(
  this: LorcanaCoreOperations,
  playerId: string,
  cause: "lore" | "opponent_loss",
): void {
  // Store win information as a trigger event for now
  // This can be processed by the game engine to handle win conditions
  if (!this.state.G.triggerEvents) {
    this.state.G.triggerEvents = [];
  }

  this.state.G.triggerEvents.push({
    type: "gameWin",
    timing: "gameStateCheck",
    characterId: playerId, // Store winner in characterId field
    timestamp: Date.now(),
    locationId: cause, // Store cause in locationId field
  });

  // Set game as finished
  this.state.ctx.gameOver = true;
  this.state.ctx.winner = playerId;
}

/**
 * Handle player loss
 */
function handlePlayerLoss(
  this: LorcanaCoreOperations,
  playerId: string,
  cause: "empty_deck",
): void {
  // In a 2-player game, if one player loses, the other wins
  const allPlayerIds = Object.keys(this.state.ctx.players);
  const remainingPlayers = allPlayerIds.filter((id) => id !== playerId);

  if (remainingPlayers.length === 1) {
    handlePlayerWin.call(this, remainingPlayers[0], "opponent_loss");
  }
}
