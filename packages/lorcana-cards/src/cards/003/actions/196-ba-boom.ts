import type { ActionCard } from "@tcg/lorcana-types";

export const baboom: ActionCard = {
  id: "1it",
  cardType: "action",
  name: "Ba-Boom!",
  inkType: ["steel"],
  franchise: "Treasure Planet",
  set: "003",
  text: "Deal 2 damage to chosen character or location.",
  cost: 2,
  cardNumber: 196,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "c59c3bcfed28db27429200453a290d6c6b63217c",
  },
  abilities: [
    {
      id: "1it-1",
      type: "action",
      effect: {
        type: "deal-damage",
        amount: 2,
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
      text: "Deal 2 damage to chosen character or location.",
    },
  ],
};
