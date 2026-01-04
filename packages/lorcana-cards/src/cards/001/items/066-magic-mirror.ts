import type { ItemCard } from "@tcg/lorcana-types";

export const magicMirrorundefined: ItemCard = {
  id: "bql",
  cardType: "item",
  name: "Magic Mirror",
  version: "undefined",
  fullName: "Magic Mirror - undefined",
  inkType: ["amethyst"],
  franchise: "Disney",
  set: "001",
  text: "**Speak** {E}, 4 {I} - Draw a card.",
  cost: 2,
  cardNumber: 66,
  inkable: true,
  externalIds: {
    ravensburger: "",
  },
  abilities: [
    {
      type: "action",
      text: "**Speak** {E}, 4 {I} - Draw a card.",
      id: "bql-1",
      effect: {
        type: "draw",
        amount: 1,
        target: "CONTROLLER",
      },
    },
  ],
};
