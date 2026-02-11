import type { ItemCard } from "@tcg/lorcana-types";

export const dragonGem: ItemCard = {
  abilities: [
    {
      cost: { exert: true },
      effect: {
        type: "return-to-hand",
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
      id: "1oa-1",
      text: "BRING BACK TO LIFE {E}, 3 {I} — Return a character card with Support from your discard to your hand.",
      type: "activated",
    },
  ],
  cardNumber: 33,
  cardType: "item",
  cost: 3,
  externalIds: {
    ravensburger: "d949d7861529ad29092c24434a719aa73cfff97d",
  },
  franchise: "Raya and the Last Dragon",
  id: "1oa",
  inkType: ["amber"],
  inkable: false,
  missingTests: true,
  name: "Dragon Gem",
  set: "002",
  text: "BRING BACK TO LIFE {E}, 3 {I} — Return a character card with Support from your discard to your hand.",
};
