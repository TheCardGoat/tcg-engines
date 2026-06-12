import type { CharacterCard } from "@tcg/lorcana-types";
import { minnieMousePracticalTravelerEpicI18n } from "./219-minnie-mouse-practical-traveler-epic.i18n";
import { minnieMousePracticalTraveler } from "./159-minnie-mouse-practical-traveler";

export const minnieMousePracticalTravelerEpic: CharacterCard = {
  ...minnieMousePracticalTraveler,
  id: "z12",
  cardNumber: 219,
  rarity: "common",
  specialRarity: "epic",
  i18n: minnieMousePracticalTravelerEpicI18n,
};
