import type { ItemCard } from "@tcg/lorcana-types";
import { sunglassesI18n } from "./202-sunglasses.i18n";

export const sunglasses: ItemCard = {
  id: "5mj",
  canonicalId: "ci_5mj",
  reprints: ["set6-202"],
  cardType: "item",
  name: "Sunglasses",
  inkType: ["steel"],
  franchise: "Lilo and Stitch",
  set: "006",
  cardNumber: 202,
  rarity: "common",
  cost: 4,
  inkable: true,
  externalIds: {
    lorcast: "crd_2ae2d2f7e846489a802db83587a26fc3",
    tcgPlayer: 587753,
  },
  text: [
    {
      title: "SPYCRAFT",
      description: "{E} — Draw a card, then choose and discard a card.",
    },
  ],
  abilities: [
    {
      cost: {
        exert: true,
      },
      effect: {
        steps: [
          {
            amount: 1,
            target: "CONTROLLER",
            type: "draw",
          },
          {
            amount: 1,
            chosen: true,
            from: "hand",
            target: "CONTROLLER",
            type: "discard",
          },
        ],
        type: "sequence",
      },
      id: "18a-1",
      name: "SPYCRAFT",
      text: "SPYCRAFT {E} — Draw a card, then choose and discard a card.",
      type: "activated",
    },
  ],
  i18n: sunglassesI18n,
};
