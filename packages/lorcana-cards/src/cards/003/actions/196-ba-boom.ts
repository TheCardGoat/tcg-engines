import type { ActionCard } from "@tcg/lorcana-types";

export const baboom: ActionCard = {
  abilities: [
    {
      effect: {
        amount: 2,
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
        type: "deal-damage",
      },
      id: "1it-1",
      text: "Deal 2 damage to chosen character or location.",
      type: "action",
    },
  ],
  cardNumber: 196,
  cardType: "action",
  cost: 2,
  externalIds: {
    ravensburger: "c59c3bcfed28db27429200453a290d6c6b63217c",
  },
  franchise: "Treasure Planet",
  id: "1it",
  inkType: ["steel"],
  inkable: true,
  missingTests: true,
  name: "Ba-Boom!",
  set: "003",
  text: "Deal 2 damage to chosen character or location.",
};
