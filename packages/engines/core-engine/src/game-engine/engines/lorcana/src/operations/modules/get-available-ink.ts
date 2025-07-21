import type { LorcanaCoreOperations } from "../lorcana-core-operations";

/**
 * Get the number of available (ready) ink cards for a player
 * This is used for cost validation
 */
export function getAvailableInk(
  this: LorcanaCoreOperations,
  playerId: string,
): number {
  // Get only ready (non-exerted) ink cards for the player
  const readyInkCards = this.getCardsInZone("inkwell", playerId).filter(
    (card) => !this.state.G.metas[card.instanceId]?.exerted,
  );

  return readyInkCards.length;
}
