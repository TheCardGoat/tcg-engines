import type { ItemCard } from "@tcg/lorcana-types";
import { juniorWoodchuckGuidebookI18n } from "./066-junior-woodchuck-guidebook.i18n";

export const juniorWoodchuckGuidebook: ItemCard = {
  id: "kZV",
  canonicalId: "ci_kZV",
  reprints: ["set10-066"],
  cardType: "item",
  name: "Junior Woodchuck Guidebook",
  inkType: ["amethyst"],
  franchise: "Ducktales",
  set: "010",
  cardNumber: 66,
  rarity: "common",
  cost: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_531cdf5a74f047b29e6129e583b12aa3",
    tcgPlayer: 659448,
  },
  text: [
    {
      title: "THE BOOK KNOWS EVERYTHING",
      description: "{E}, 1 {I}, Banish this item — Draw 2 cards.",
    },
  ],
  abilities: [
    {
      id: "ebe-1",
      cost: {
        exert: true,
        ink: 1,
        banishSelf: true,
      },
      effect: {
        amount: 2,
        target: "CONTROLLER",
        type: "draw",
      },
      name: "THE BOOK KNOWS EVERYTHING",
      type: "activated",
      text: "THE BOOK KNOWS EVERYTHING {E}, 1 {I}, Banish this item — Draw 2 cards.",
    },
  ],
  i18n: juniorWoodchuckGuidebookI18n,
};
