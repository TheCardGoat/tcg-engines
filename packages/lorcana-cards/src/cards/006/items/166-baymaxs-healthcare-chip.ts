import type { ItemCard } from "@tcg/lorcana-types";

export const baymaxsHealthcareChip: ItemCard = {
  id: "1di",
  cardType: "item",
  name: "Baymax's Healthcare Chip",
  inkType: ["sapphire"],
  franchise: "Big Hero 6",
  set: "006",
  text: "10,000 MEDICAL PROCEDURES {E} - Choose one:\n* Remove up to 1 damage from chosen character. \n* If you have a Robot character in play, remove up to 3 damage from chosen character.",
  cost: 2,
  cardNumber: 166,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "b33bfde84513a383239b388b7a1c80ab8e6d98e2",
  },
  abilities: [
    {
      id: "1di-2",
      type: "action",
      effect: {
        type: "remove-damage",
        amount: 1,
        upTo: true,
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
      text: "* Remove up to 1 damage from chosen character.",
    },
    {
      id: "1di-3",
      type: "action",
      effect: {
        type: "conditional",
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
      },
      text: "* If you have a Robot character in play, remove up to 3 damage from chosen character.",
    },
  ],
};
