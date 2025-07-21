import type { LorcanaCoreOperations } from "../lorcana-core-operations";

/**
 * Check if a character can quest (Lorcana-specific rules)
 */
export function canCharacterQuest(
  this: LorcanaCoreOperations,
  characterId: string,
): boolean {
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
