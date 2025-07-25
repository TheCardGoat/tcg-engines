import { createContextWithGameOver } from "~/game-engine/core-engine/utils/context-factory";
import { logger } from "~/shared/logger";
import type {
  LorcanaCardFilter,
  LorcanaPlayerState,
} from "../../lorcana-engine-types";
import type { LorcanaCoreOperations } from "../lorcana-core-operations";

// **1.9. Game State Check**
//
// **1.9.1.   **There is a set of conditions the game checks for with certain required actions happening when one or more of those conditions is met.
//              This is called a game state check and is made up of two parts: the game state condition and the required action.
//              A game state condition is a specific circumstance the game state can achieve.
//              A required action is what happens in the game when a game state condition is met.
//              The following are the conditions that the game state check looks for and the required action each creates.
// **1.9.1.1. **If a player has 20 or more lore, that player wins the game.
// **1.9.1.2. **If a player attempted to draw from a deck with no cards since the last game state check, that player loses the game.
// **1.9.1.3. **If a character or location has damage equal to or greater than its Wil power \{W\}, that character or location is banished.
// **1.9.2.   **A game state check is made at the end of every step, after any action or ability is finished resolving, and after each effect in the bag is finished resolving.
//              During a game state check, first check and complete all win and loss conditions and required actions.
//              Then if there are no win or loss conditions met, check and complete all other conditions and required actions.
//              Once all required actions are complete, the game state check repeats until there are no further required actions to complete.
//              Triggered abilities that occurred during this process are then added to the bag to resolve.
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
    if (this.state.ctx.gameOver || this.state.ctx.winner) {
      logger.debug("Game is over, skipping game state check");
      break;
    }

    hasRequiredActions = false;
    loopCounter++;

    const playerIds = Object.keys(this.state.ctx.players);

    // 1.9.1.1. Check for win condition: If a player has 20 or more lore, that player wins
    for (const playerId of playerIds) {
      const playerState = this.state.ctx.players[playerId];
      if (playerState && "lore" in playerState && playerState.lore >= 20) {
        logger.debug(`Player ${playerId} wins with lore ${playerState.lore}`);

        // Use immutable context update instead of direct mutation
        this.state.ctx = createContextWithGameOver(this.state.ctx, playerId);
        hasRequiredActions = true; // Set this to true to indicate a state change occurred
        break; // Exit the loop since we found a winner
      }
    }

    // TODO: IMPLEMENT LATER, SKIP FOR NOW
    // 1.9.1.2. Check for loss condition: If a player attempted to draw from empty deck
    // Note: This would need to be tracked when drawing cards - placeholder for now
    // for (const playerId of playerIds) {
    //   const deck = this.getCardsInZone("deck", playerId);
    //   // This check would be implemented when draw mechanics are added
    //   // For now, we skip this check as the property doesn't exist in LorcanaPlayerState yet
    // }

    // 1.9.1.3. Check for banishment: Characters/locations with damage >= willpower
    // Rule: If a character or location has damage equal to or greater than its Willpower {W},
    // that character or location is banished.
    const allPlayCards = this.getCardsInZone("play");
    const cardsToBanish: string[] = [];

    // First, identify all cards that should be banished
    for (const card of allPlayCards) {
      const damage = this.state.G.metas[card.instanceId]?.damage || 0;
      const willpower = (card.card as any).willpower || 0;
      const cardType = card.card.type;

      // Only check cards that have willpower (characters and locations)
      // Rule 1.9.1.3 applies to characters and locations with willpower > 0
      if (damage >= willpower && willpower > 0) {
        const cardTypeStr = Array.isArray(cardType) ? cardType[0] : cardType;
        logger.debug(
          `Banishment check: ${cardTypeStr} ${card.instanceId} has damage ${damage} >= willpower ${willpower}`,
        );
        cardsToBanish.push(card.instanceId);
      }
    }

    // Then banish all identified cards simultaneously (Rule 1.9.5)
    if (cardsToBanish.length > 0) {
      logger.info(
        `Banishing ${cardsToBanish.length} cards due to damage >= willpower`,
      );

      for (const cardId of cardsToBanish) {
        const ownerId = this.getCardOwner(cardId);
        if (ownerId) {
          // Move card to discard (banishment)
          this.moveCard({
            playerId: ownerId,
            instanceId: cardId,
            to: "discard",
          });

          // Clear damage when card leaves play (Rule 9.4.1)
          // "When a card with damage leaves play, when game states are checked
          // all damage counters on it cease to exist."
          if (this.state.G.metas[cardId]) {
            this.state.G.metas[cardId].damage = 0;
          }

          // TODO: Add banishment triggered effects to bag
          // Effects like "When this character is banished" should trigger here
          // This will be implemented when the triggered effect system is ready

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
