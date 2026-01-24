import type { ActionCard } from "@tcg/lorcana-types";

export const restoringTheHeart: ActionCard = {
  id: "inl",
  cardType: "action",
  name: "Restoring the Heart",
  inkType: ["amber", "sapphire"],
  franchise: "Moana",
  set: "007",
  text: "Remove up to 3 damage from chosen character or location. Draw a card.",
  cost: 1,
  cardNumber: 39,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "433c65f67c223f90311aefde360c4a70f5b3776e",
  },
  abilities: [
    {
      id: "inl-1",
      type: "action",
      effect: {
        type: "choice",
        options: [
          {
            type: "remove-damage",
            amount: 3,
            upTo: true,
            target: {
              selector: "chosen",
              count: 1,
              owner: "any",
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
        optionLabels: [
          "Remove up to 3 damage from chosen character",
          "location. Draw a card.",
        ],
      },
      text: "Remove up to 3 damage from chosen character or location. Draw a card.",
    },
  ],
};
