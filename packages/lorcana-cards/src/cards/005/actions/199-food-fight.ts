import type { ActionCard } from "@tcg/lorcana-types";

export const foodFight: ActionCard = {
  abilities: [
    {
      cost: { exert: true },
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
      id: "1ww-1",
      text: "Your characters gain “{E}, 1 {I} — Deal 1 damage to chosen character” this turn.",
      type: "activated",
    },
  ],
  cardNumber: 199,
  cardType: "action",
  cost: 1,
  externalIds: {
    ravensburger: "f85cdc600cc088e804abb8ad835dbe403eb00bdf",
  },
  id: "1ww",
  inkType: ["steel"],
  inkable: false,
  missingTests: true,
  name: "Food Fight!",
  set: "005",
  text: "Your characters gain “{E}, 1 {I} — Deal 1 damage to chosen character” this turn.",
};
