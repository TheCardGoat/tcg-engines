import type { ActionCard } from "@tcg/lorcana-types";

export const lightTheFuse: ActionCard = {
  id: "f06",
  cardType: "action",
  name: "Light the Fuse",
  inkType: ["ruby", "steel"],
  franchise: "Mulan",
  set: "008",
  text: "Deal 1 damage to chosen character for each exerted character you have in play.",
  cost: 1,
  cardNumber: 149,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "3614498b58e0cf1cc33837d6960c31671cbd30a9",
  },
  abilities: [
    {
      id: "f06-1",
      type: "action",
      effect: {
        type: "deal-damage",
        amount: 1,
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
      text: "Deal 1 damage to chosen character for each exerted character you have in play.",
    },
  ],
};
