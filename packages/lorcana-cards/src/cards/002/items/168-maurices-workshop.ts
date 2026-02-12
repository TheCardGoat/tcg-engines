import type { ItemCard } from "@tcg/lorcana-types";

export const mauricesWorkshop: ItemCard = {
  abilities: [
    {
      effect: {
        type: "optional",
        effect: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
        chooser: "CONTROLLER",
      },
      id: "18c-1",
      name: "LOOKING FOR THIS?",
      text: "LOOKING FOR THIS? Whenever you play another item, you may pay 1 {I} to draw a card.",
      trigger: { event: "play", timing: "when", on: "SELF" },
      type: "triggered",
    },
  ],
  cardNumber: 168,
  cardType: "item",
  cost: 3,
  externalIds: {
    ravensburger: "9eb2122e42f3807342d6c09800108855dec2073b",
  },
  franchise: "Beauty and the Beast",
  id: "18c",
  inkType: ["sapphire"],
  inkable: false,
  missingTests: true,
  name: "Maurice's Workshop",
  set: "002",
  text: "LOOKING FOR THIS? Whenever you play another item, you may pay 1 {I} to draw a card.",
};
