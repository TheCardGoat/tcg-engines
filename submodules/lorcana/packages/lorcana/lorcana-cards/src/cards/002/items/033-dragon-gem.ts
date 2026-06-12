import type { ItemCard } from "@tcg/lorcana-types";
import { dragonGemI18n } from "./033-dragon-gem.i18n";

export const dragonGem: ItemCard = {
  id: "1DR",
  canonicalId: "ci_1DR",
  reprints: ["set2-033"],
  cardType: "item",
  name: "Dragon Gem",
  inkType: ["amber"],
  franchise: "Raya and the Last Dragon",
  set: "002",
  cardNumber: 33,
  rarity: "rare",
  cost: 3,
  inkable: false,
  externalIds: {
    lorcast: "crd_9d869b2d59da48ad81923dc474ab2bfc",
    tcgPlayer: 526346,
  },
  text: [
    {
      title: "BRING BACK TO LIFE",
      description:
        "{E}, 3 {I} — Return a character card with Support from your discard to your hand.",
    },
  ],
  abilities: [
    {
      cost: {
        exert: true,
        ink: 3,
      },
      effect: {
        cardType: "character",
        filter: {
          type: "has-keyword",
          keyword: "Support",
        },
        target: "CONTROLLER",
        type: "return-from-discard",
      },
      id: "1oa-1",
      name: "BRING BACK TO LIFE",
      text: "BRING BACK TO LIFE {E}, 3 {I} — Return a character card with Support from your discard to your hand.",
      type: "activated",
    },
  ],
  i18n: dragonGemI18n,
};
