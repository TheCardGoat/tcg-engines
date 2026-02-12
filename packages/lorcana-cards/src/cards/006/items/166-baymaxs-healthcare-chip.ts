import type { ItemCard } from "@tcg/lorcana-types";

export const baymaxsHealthcareChip: ItemCard = {
  abilities: [
    {
      effect: {
        amount: 1,
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
        type: "remove-damage",
        upTo: true,
      },
      id: "1di-2",
      text: "* Remove up to 1 damage from chosen character.",
      type: "action",
    },
    {
      effect: {
        condition: {
          type: "if",
          expression: "you have a Robot character in play",
        },
        then: {
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
        type: "conditional",
      },
      id: "1di-3",
      text: "* If you have a Robot character in play, remove up to 3 damage from chosen character.",
      type: "action",
    },
  ],
  cardNumber: 166,
  cardType: "item",
  cost: 2,
  externalIds: {
    ravensburger: "b33bfde84513a383239b388b7a1c80ab8e6d98e2",
  },
  franchise: "Big Hero 6",
  id: "1di",
  inkType: ["sapphire"],
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  name: "Baymax's Healthcare Chip",
  set: "006",
  text: "10,000 MEDICAL PROCEDURES {E} - Choose one:\n* Remove up to 1 damage from chosen character. \n* If you have a Robot character in play, remove up to 3 damage from chosen character.",
};
