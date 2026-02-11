import type { ItemCard } from "@tcg/lorcana-types";

export const goldCoin: ItemCard = {
  abilities: [
    {
      effect: {
        type: "restriction",
        restriction: "cant-quest",
        target: "SELF",
        duration: "this-turn",
      },
      id: "1fl-1",
      text: "GLITTERING ACCESS {E}, 1 {I}, Banish this item – Ready chosen character of yours. They can't quest for the rest of this turn.",
      type: "action",
    },
  ],
  cardNumber: 133,
  cardType: "item",
  cost: 1,
  externalIds: {
    ravensburger: "b829707b48b92131aeda84cb34488cb3ae66cffa",
  },
  franchise: "Wreck It Ralph",
  id: "1fl",
  inkType: ["ruby"],
  inkable: true,
  missingTests: true,
  name: "Gold Coin",
  set: "006",
  text: "GLITTERING ACCESS {E}, 1 {I}, Banish this item – Ready chosen character of yours. They can't quest for the rest of this turn.",
};
