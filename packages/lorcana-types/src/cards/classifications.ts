/**
 * Classifications (Rule 6.2.6)
 *
 * Character classifications that appear on character cards.
 * Characters can have multiple classifications.
 */

export const CLASSIFICATIONS = [
  "Alien",
  "Ally",
  "Broom",
  "Captain",
  "Deity",
  "Detective",
  "Dragon",
  "Dreamborn",
  "Entangled",
  "Fairy",
  "Floodborn",
  "Gargoyle",
  "Ghost",
  "Hero",
  "Hunny",
  "Hyena",
  "Illusion",
  "Inventor",
  "King",
  "Knight",
  "Madrigal",
  "Mentor",
  "Musketeer",
  "Pirate",
  "Prince",
  "Princess",
  "Puppy",
  "Queen",
  "Racer",
  "Robot",
  "Seven Dwarfs",
  "Sorcerer",
  "Storyborn",
  "Tigger",
  "Titan",
  "Villain",
  "Whisper",
] as const;

export type Classification = (typeof CLASSIFICATIONS)[number];

/**
 * Check if a value is a valid classification
 */
export function isClassification(value: unknown): value is Classification {
  return typeof value === "string" && CLASSIFICATIONS.includes(value as Classification);
}

/**
 * Check if a classification is Storyborn
 */
export function isStoryborn(classification: Classification): boolean {
  return classification === "Storyborn";
}

/**
 * Check if a classification is Floodborn
 */
export function isFloodborn(classification: Classification): boolean {
  return classification === "Floodborn";
}

/**
 * Check if a classification is Dreamborn
 */
export function isDreamborn(classification: Classification): boolean {
  return classification === "Dreamborn";
}

/**
 * Get all classifications
 */
export function getAllClassifications(): readonly Classification[] {
  return CLASSIFICATIONS;
}
