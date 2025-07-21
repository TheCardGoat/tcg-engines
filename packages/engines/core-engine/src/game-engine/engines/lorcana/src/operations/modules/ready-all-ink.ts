import type { LorcanaCoreOperations } from "../lorcana-core-operations";

/**
 * Ready all ink cards for a player (start of turn in Lorcana)
 */
export function readyAllInk(
  this: LorcanaCoreOperations,
  playerId: string,
): void {
  const inkCards = this.getCardsInZone("inkwell", playerId);

  for (const inkCard of inkCards) {
    this.readyCard(inkCard.instanceId);
  }
}
