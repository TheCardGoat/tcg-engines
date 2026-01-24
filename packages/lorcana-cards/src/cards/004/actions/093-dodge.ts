import type { ActionCard } from "@tcg/lorcana-types";

export const dodge: ActionCard = {
  id: "2c5",
  cardType: "action",
  name: "Dodge!",
  inkType: ["emerald"],
  set: "004",
  text: "Chosen character gains Ward and Evasive until the start of your next turn. (Opponents can't choose them except to challenge. Only characters with Evasive can challenge them.)",
  cost: 2,
  cardNumber: 93,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "086cbb4a18c9cc21f6ba04e1011c055bd4c551a4",
  },
  abilities: [
    {
      id: "2c5-1",
      type: "action",
      effect: {
        type: "gain-keyword",
        keyword: "Ward",
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
      text: "Chosen character gains Ward and Evasive until the start of your next turn.",
    },
  ],
};
