import type { LorcanaCoreOperations } from "../lorcana-core-operations";

/**
 * Check if a character can challenge (Lorcana-specific rules)
 */
export function canCharacterChallenge(
  this: LorcanaCoreOperations,
  characterId: string,
): boolean {
  const character = this.getCardInstance(characterId);

  // Character must be in play and not exerted
  const zone = this.getCardZone(characterId);
  if (zone !== "play") return false;

  // Check if character is exerted
  if (character.isExerted) return false;

  // Character must have strength to challenge
  return (character.card.strength || 0) > 0;
}
