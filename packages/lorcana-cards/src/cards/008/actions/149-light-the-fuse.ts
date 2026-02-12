import type { ActionCard } from "@tcg/lorcana-types";

export const lightTheFuse: ActionCard = {
  abilities: [
    {
      effect: {
        amount: 1,
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "deal-damage",
      },
      id: "f06-1",
      text: "Deal 1 damage to chosen character for each exerted character you have in play.",
      type: "action",
    },
  ],
  cardNumber: 149,
  cardType: "action",
  cost: 1,
  externalIds: {
    ravensburger: "3614498b58e0cf1cc33837d6960c31671cbd30a9",
  },
  franchise: "Mulan",
  id: "f06",
  inkType: ["ruby", "steel"],
  inkable: false,
  missingTests: true,
  name: "Light the Fuse",
  set: "008",
  text: "Deal 1 damage to chosen character for each exerted character you have in play.",
};
