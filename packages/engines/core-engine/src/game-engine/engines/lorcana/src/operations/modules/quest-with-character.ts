import type { LorcanaPlayerState } from "../../lorcana-generic-types";
import type { LorcanaCoreOperations } from "../lorcana-core-operations";

/**
 * Quest with a character
 * Implements Lorcana-specific questing mechanics
 */
export function questWithCharacter(
  this: LorcanaCoreOperations,
  characterId: string,
): void {
  const character = this.getCardInstance(characterId);
  const lore = character.card.lore || 0;

  // Add lore to player's total (stored in ctx.players)
  const playerId = this.getCardOwner(characterId);
  if (playerId && this.state.ctx.players[playerId]) {
    const playerState = this.state.ctx.players[playerId] as LorcanaPlayerState;
    playerState.lore += lore;
  }

  // Exert the character (update meta)
  this.exertCard(characterId);
}
