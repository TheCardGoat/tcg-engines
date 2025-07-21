import type { LorcanaCoreOperations } from "../lorcana-core-operations";

/**
 * Exert ink cards to pay for costs
 * This is a Lorcana-specific mechanism for paying costs with ink
 */
export function exertInkForCost(
  this: LorcanaCoreOperations,
  playerId: string,
  cost: number,
): boolean {
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
