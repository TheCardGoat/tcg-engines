import type { ItemCard } from "@tcg/lorcana-types";

export const jumboPop: ItemCard = {
  id: "lhl",
  cardType: "item",
  name: "Jumbo Pop",
  inkType: ["sapphire"],
  franchise: "Zootropolis",
  set: "006",
  text: "HERE YOU GO Banish this item – Remove up to 2 damage from each of your characters. Draw a card.",
  cost: 3,
  cardNumber: 168,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "4d728e0fadc5e557dc4683c3c646e1cd6816ab7b",
  },
  abilities: [
    {
      id: "lhl-1",
      type: "static",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "remove-damage",
            amount: 2,
            upTo: true,
            target: {
              selector: "all",
              count: "all",
              owner: "you",
              zones: ["play"],
              cardTypes: ["character"],
            },
          },
          {
            type: "draw",
            amount: 1,
            target: "CONTROLLER",
          },
        ],
      },
      text: "HERE YOU GO Banish this item – Remove up to 2 damage from each of your characters. Draw a card.",
    },
  ],
};
