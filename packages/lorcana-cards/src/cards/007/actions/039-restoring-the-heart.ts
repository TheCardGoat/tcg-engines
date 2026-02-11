import type { ActionCard } from "@tcg/lorcana-types";

export const restoringTheHeart: ActionCard = {
  abilities: [
    {
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
      id: "inl-1",
      text: "Remove up to 3 damage from chosen character or location. Draw a card.",
      type: "action",
    },
  ],
  cardNumber: 39,
  cardType: "action",
  cost: 1,
  externalIds: {
    ravensburger: "433c65f67c223f90311aefde360c4a70f5b3776e",
  },
  franchise: "Moana",
  id: "inl",
  inkType: ["amber", "sapphire"],
  inkable: true,
  missingTests: true,
  name: "Restoring the Heart",
  set: "007",
  text: "Remove up to 3 damage from chosen character or location. Draw a card.",
};
