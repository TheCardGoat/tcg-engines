import type { CharacterCard } from "@tcg/lorcana-types";
import { donaldDuckDistractedTravelerEpicI18n } from "./212-donald-duck-distracted-traveler-epic.i18n";
import { donaldDuckDistractedTraveler } from "./084-donald-duck-distracted-traveler";

export const donaldDuckDistractedTravelerEpic: CharacterCard = {
  ...donaldDuckDistractedTraveler,
  id: "1yb",
  cardNumber: 212,
  rarity: "common",
  specialRarity: "epic",
  i18n: donaldDuckDistractedTravelerEpicI18n,
};
