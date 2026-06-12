import type { CharacterCard } from "@tcg/lorcana-types";
import { floraGoodFairyI18n } from "./075-flora-good-fairy.i18n";

export const floraGoodFairy: CharacterCard = {
  id: "ZS7",
  canonicalId: "ci_ZS7",
  reprints: ["set5-075"],
  cardType: "character",
  name: "Flora",
  version: "Good Fairy",
  inkType: ["emerald"],
  franchise: "Sleeping Beauty",
  set: "005",
  cardNumber: 75,
  rarity: "common",
  cost: 3,
  strength: 2,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_b72fb20c7b664b749e55de43aae47b3c",
    tcgPlayer: 560641,
  },
  text: [
    {
      title: "FIDDLE FADDLE",
      description: "While being challenged, this character gets +2 {S}.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Fairy"],
  abilities: [
    {
      condition: {
        role: "defender",
        type: "in-challenge",
      },
      effect: {
        modifier: 2,
        stat: "strength",
        target: "SELF",
        type: "modify-stat",
      },
      id: "awe-1",
      name: "FIDDLE FADDLE",
      text: "FIDDLE FADDLE While being challenged, this character gets +2 {S}.",
      type: "static",
    },
  ],
  i18n: floraGoodFairyI18n,
};
