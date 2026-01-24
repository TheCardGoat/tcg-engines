import type { ActionCard } from "@tcg/lorcana-types";

export const restoringAtlantis: ActionCard = {
  id: "g4p",
  cardType: "action",
  name: "Restoring Atlantis",
  inkType: ["steel"],
  franchise: "Atlantis",
  set: "007",
  text: "Your characters can't be challenged until the start of your next turn.",
  cost: 5,
  cardNumber: 201,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "3a22bf1160fb323ece5b18abbcd5823cf6c9e990",
  },
  abilities: [
    {
      id: "g4p-1",
      type: "static",
      effect: {
        type: "restriction",
        restriction: "cant-be-challenged",
        target: "SELF",
      },
      text: "Your characters can't be challenged until the start of your next turn.",
    },
  ],
};
