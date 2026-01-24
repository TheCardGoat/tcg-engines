import type { ActionCard } from "@tcg/lorcana-types";

export const teethAndAmbitions: ActionCard = {
  id: "c3r",
  cardType: "action",
  name: "Teeth and Ambitions",
  inkType: ["ruby"],
  franchise: "Lion King",
  set: "002",
  text: "Deal 2 damage to chosen character of yours to deal 2 damage to another chosen character.",
  actionSubtype: "song",
  cost: 2,
  cardNumber: 130,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "2ba03555a3279d07af241b0111de37b386da6424",
  },
  abilities: [
    {
      id: "c3r-1",
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
      text: "Deal 2 damage to chosen character of yours to deal 2 damage to another chosen character.",
    },
  ],
};
