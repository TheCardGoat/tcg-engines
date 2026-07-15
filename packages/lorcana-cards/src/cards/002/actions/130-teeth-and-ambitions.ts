import type { ActionCard } from "@tcg/lorcana-types";

export const teethAndAmbitions: ActionCard = {
  abilities: [
    {
      effect: {
        amount: 2,
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "deal-damage",
      },
      id: "c3r-1",
      text: "Deal 2 damage to chosen character of yours to deal 2 damage to another chosen character.",
      type: "action",
    },
  ],
  actionSubtype: "song",
  cardNumber: 130,
  cardType: "action",
  cost: 2,
  externalIds: {
    ravensburger: "2ba03555a3279d07af241b0111de37b386da6424",
  },
  franchise: "Lion King",
  id: "c3r",
  inkType: ["ruby"],
  inkable: true,
  missingTests: true,
  name: "Teeth and Ambitions",
  set: "002",
  text: "Deal 2 damage to chosen character of yours to deal 2 damage to another chosen character.",
};
