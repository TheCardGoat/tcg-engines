import type { CharacterCard } from "@tcg/lorcana-types";
import { lenaSabrewingRebelliousTeenagerI18n } from "./043-lena-sabrewing-rebellious-teenager.i18n";

export const lenaSabrewingRebelliousTeenager: CharacterCard = {
  id: "tnp",
  canonicalId: "ci_tnp",
  reprints: ["set3-043"],
  cardType: "character",
  name: "Lena Sabrewing",
  version: "Rebellious Teenager",
  inkType: ["amethyst"],
  franchise: "Ducktales",
  set: "003",
  cardNumber: 43,
  rarity: "common",
  cost: 2,
  strength: 1,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_d8f0d093ffa743e48801e90e1b98cf14",
    tcgPlayer: 538238,
  },
  text: "Rush",
  classifications: ["Storyborn", "Hero", "Sorcerer"],
  abilities: [
    {
      id: "1j4-1",
      keyword: "Rush",
      type: "keyword",
      text: "Rush",
    },
  ],
  i18n: lenaSabrewingRebelliousTeenagerI18n,
};
