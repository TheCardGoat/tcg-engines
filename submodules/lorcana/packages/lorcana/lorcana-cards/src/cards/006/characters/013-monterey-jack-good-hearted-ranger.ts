import type { CharacterCard } from "@tcg/lorcana-types";
import { montereyJackGoodheartedRangerI18n } from "./013-monterey-jack-good-hearted-ranger.i18n";

export const montereyJackGoodheartedRanger: CharacterCard = {
  id: "uAr",
  canonicalId: "ci_uAr",
  reprints: ["set6-013"],
  cardType: "character",
  name: "Monterey Jack",
  version: "Good-Hearted Ranger",
  inkType: ["amber"],
  franchise: "Rescue Rangers",
  set: "006",
  cardNumber: 13,
  rarity: "rare",
  cost: 4,
  strength: 0,
  willpower: 7,
  lore: 2,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_f20ba045e5754b24b0c431115ab83dd8",
    tcgPlayer: 591996,
  },
  classifications: ["Storyborn", "Ally"],
  i18n: montereyJackGoodheartedRangerI18n,
};
