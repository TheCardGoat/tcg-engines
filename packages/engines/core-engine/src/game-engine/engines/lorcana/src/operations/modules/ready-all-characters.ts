import type { LorcanaCoreOperations } from "../lorcana-core-operations";

/**
 * Ready all characters for a player (start of turn in Lorcana)
 */
export function readyAllCharacters(
  this: LorcanaCoreOperations,
  playerId: string,
): void {
  const charactersInPlay = this.getCardsInZone("play", playerId);

  for (const character of charactersInPlay) {
    this.readyCard(character.instanceId);
  }
}
