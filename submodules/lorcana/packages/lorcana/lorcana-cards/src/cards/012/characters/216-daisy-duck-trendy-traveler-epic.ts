import type { CharacterCard } from "@tcg/lorcana-types";
import { daisyDuckTrendyTravelerEpicI18n } from "./216-daisy-duck-trendy-traveler-epic.i18n";
import { daisyDuckTrendyTraveler } from "./115-daisy-duck-trendy-traveler";

export const daisyDuckTrendyTravelerEpic: CharacterCard = {
  ...daisyDuckTrendyTraveler,
  id: "AyR",
  cardNumber: 216,
  rarity: "common",
  specialRarity: "epic",
  i18n: daisyDuckTrendyTravelerEpicI18n,
};
