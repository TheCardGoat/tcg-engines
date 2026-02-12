import type { ActionCard } from "@tcg/lorcana-types";

export const repair: ActionCard = {
  abilities: [
    {
      effect: {
        type: "remove-damage",
        amount: 3,
        upTo: true,
        target: {
          selector: "all",
          count: "all",
          owner: "you",
          zones: ["play"],
          cardTypes: ["location"],
        },
      },
      id: "1sg-1",
      text: "Remove up to 3 damage from one of your locations or characters.",
      type: "action",
    },
  ],
  cardNumber: 162,
  cardType: "action",
  cost: 2,
  externalIds: {
    ravensburger: "e8a7d6f2bc4132a0f764d5e084371ff67d21a516",
  },
  franchise: "Atlantis",
  id: "1sg",
  inkType: ["sapphire"],
  inkable: true,
  missingTests: true,
  name: "Repair",
  set: "003",
  text: "Remove up to 3 damage from one of your locations or characters.",
};
