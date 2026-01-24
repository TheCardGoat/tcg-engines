import type { ItemCard } from "@tcg/lorcana-types";

export const dragonGem: ItemCard = {
  id: "1oa",
  cardType: "item",
  name: "Dragon Gem",
  inkType: ["amber"],
  franchise: "Raya and the Last Dragon",
  set: "002",
  text: "BRING BACK TO LIFE {E}, 3 {I} — Return a character card with Support from your discard to your hand.",
  cost: 3,
  cardNumber: 33,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "d949d7861529ad29092c24434a719aa73cfff97d",
  },
  abilities: [
    {
      id: "1oa-1",
      type: "activated",
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
      text: "BRING BACK TO LIFE {E}, 3 {I} — Return a character card with Support from your discard to your hand.",
    },
  ],
};
