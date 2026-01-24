import type { ItemCard } from "@tcg/lorcana-types";

export const pixieDust: ItemCard = {
  id: "100",
  cardType: "item",
  name: "Pixie Dust",
  inkType: ["amethyst"],
  franchise: "Peter Pan",
  set: "006",
  text: "FAITH AND TRUST {E}, {2} {I} - Chosen character gains Challenger +2 and Evasive until the start of your next turn. (While challenging, they get +2 {1}. Only characters with Evasive can challenge them.)",
  cost: 4,
  cardNumber: 67,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "81bfe47645b7451e9719f784418d39de85304651",
  },
  abilities: [
    {
      id: "100-1",
      type: "action",
      effect: {
        type: "gain-keyword",
        keyword: "Challenger",
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
        value: 2,
      },
      text: "FAITH AND TRUST {E}, {2} {I} - Chosen character gains Challenger +2 and Evasive until the start of your next turn.",
    },
  ],
};
