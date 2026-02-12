import type { ItemCard } from "@tcg/lorcana-types";

export const jumboPop: ItemCard = {
  abilities: [
    {
      effect: {
        steps: [
          {
            amount: 2,
            target: {
              cardTypes: ["character"],
              count: "all",
              owner: "you",
              selector: "all",
              zones: ["play"],
            },
            type: "remove-damage",
            upTo: true,
          },
          {
            amount: 1,
            target: "CONTROLLER",
            type: "draw",
          },
        ],
        type: "sequence",
      },
      id: "lhl-1",
      text: "HERE YOU GO Banish this item – Remove up to 2 damage from each of your characters. Draw a card.",
      type: "static",
    },
  ],
  cardNumber: 168,
  cardType: "item",
  cost: 3,
  externalIds: {
    ravensburger: "4d728e0fadc5e557dc4683c3c646e1cd6816ab7b",
  },
  franchise: "Zootropolis",
  id: "lhl",
  inkType: ["sapphire"],
  inkable: false,
  missingTests: true,
  name: "Jumbo Pop",
  set: "006",
  text: "HERE YOU GO Banish this item – Remove up to 2 damage from each of your characters. Draw a card.",
};
