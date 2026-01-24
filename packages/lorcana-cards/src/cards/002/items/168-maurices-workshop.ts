import type { ItemCard } from "@tcg/lorcana-types";

export const mauricesWorkshop: ItemCard = {
  id: "18c",
  cardType: "item",
  name: "Maurice's Workshop",
  inkType: ["sapphire"],
  franchise: "Beauty and the Beast",
  set: "002",
  text: "LOOKING FOR THIS? Whenever you play another item, you may pay 1 {I} to draw a card.",
  cost: 3,
  cardNumber: 168,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "9eb2122e42f3807342d6c09800108855dec2073b",
  },
  abilities: [
    {
      id: "18c-1",
      type: "triggered",
      name: "LOOKING FOR THIS?",
      effect: {
        type: "optional",
        effect: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
        chooser: "CONTROLLER",
      },
      text: "LOOKING FOR THIS? Whenever you play another item, you may pay 1 {I} to draw a card.",
    },
  ],
};
