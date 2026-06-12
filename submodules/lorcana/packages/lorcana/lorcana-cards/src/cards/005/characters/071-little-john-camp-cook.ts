import type { CharacterCard } from "@tcg/lorcana-types";
import { littleJohnCampCookI18n } from "./071-little-john-camp-cook.i18n";

export const littleJohnCampCook: CharacterCard = {
  id: "Bph",
  canonicalId: "ci_Bph",
  reprints: ["set5-071"],
  cardType: "character",
  name: "Little John",
  version: "Camp Cook",
  inkType: ["emerald"],
  franchise: "Robin Hood",
  set: "005",
  cardNumber: 71,
  rarity: "uncommon",
  cost: 1,
  strength: 0,
  willpower: 4,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_715fd7db81234ccc970f710f0c4d469e",
    tcgPlayer: 561191,
  },
  classifications: ["Storyborn", "Ally"],
  i18n: littleJohnCampCookI18n,
};
