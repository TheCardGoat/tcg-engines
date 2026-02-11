import type { ItemCard } from "@tcg/lorcana-types";

export const pixieDust: ItemCard = {
  abilities: [
    {
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
      id: "100-1",
      text: "FAITH AND TRUST {E}, {2} {I} - Chosen character gains Challenger +2 and Evasive until the start of your next turn.",
      type: "action",
    },
  ],
  cardNumber: 67,
  cardType: "item",
  cost: 4,
  externalIds: {
    ravensburger: "81bfe47645b7451e9719f784418d39de85304651",
  },
  franchise: "Peter Pan",
  id: "100",
  inkType: ["amethyst"],
  inkable: false,
  missingTests: true,
  name: "Pixie Dust",
  set: "006",
  text: "FAITH AND TRUST {E}, {2} {I} - Chosen character gains Challenger +2 and Evasive until the start of your next turn. (While challenging, they get +2 {1}. Only characters with Evasive can challenge them.)",
};
