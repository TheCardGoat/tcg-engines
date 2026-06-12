import type { CharacterCard } from "@tcg/lorcana-types";
import { goofyKnightForADayI18n } from "./180-goofy-knight-for-a-day.i18n";

export const goofyKnightForADay: CharacterCard = {
  id: "JDP",
  canonicalId: "ci_JDP",
  reprints: ["set2-180"],
  cardType: "character",
  name: "Goofy",
  version: "Knight for a Day",
  inkType: ["steel"],
  set: "002",
  cardNumber: 180,
  rarity: "rare",
  cost: 9,
  strength: 10,
  willpower: 10,
  lore: 4,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_3efeba396af644afb4fbef6c35b58521",
    tcgPlayer: 524364,
  },
  classifications: ["Dreamborn", "Hero", "Knight"],
  i18n: goofyKnightForADayI18n,
};
