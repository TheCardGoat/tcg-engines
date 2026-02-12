import type { ItemCard } from "@tcg/lorcana-types";

export const magicMirror: ItemCard = {
  abilities: [
    {
      cost: {
        exert: true,
      },
      effect: {
        amount: 1,
        target: "CONTROLLER",
        type: "draw",
      },
      id: "6c3-1",
      text: "SPEAK! {E}, 4 {I} — Draw a card.",
      type: "activated",
    },
  ],
  cardNumber: 65,
  cardType: "item",
  cost: 2,
  externalIds: {
    ravensburger: "16d5c6f33f2646ad892f3449ed12b5f00a046833",
  },
  franchise: "Snow White",
  id: "6c3",
  inkType: ["amethyst"],
  inkable: false,
  name: "Magic Mirror",
  set: "009",
  text: "SPEAK! {E}, 4 {I} — Draw a card.",
};
