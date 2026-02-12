import type { ActionCard } from "@tcg/lorcana-types";

export const dodge: ActionCard = {
  abilities: [
    {
      effect: {
        keyword: "Ward",
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
        type: "gain-keyword",
      },
      id: "2c5-1",
      text: "Chosen character gains Ward and Evasive until the start of your next turn.",
      type: "action",
    },
  ],
  cardNumber: 93,
  cardType: "action",
  cost: 2,
  externalIds: {
    ravensburger: "086cbb4a18c9cc21f6ba04e1011c055bd4c551a4",
  },
  id: "2c5",
  inkType: ["emerald"],
  inkable: true,
  missingTests: true,
  name: "Dodge!",
  set: "004",
  text: "Chosen character gains Ward and Evasive until the start of your next turn. (Opponents can't choose them except to challenge. Only characters with Evasive can challenge them.)",
};
