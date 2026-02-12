import type { ActionCard } from "@tcg/lorcana-types";

export const restoringAtlantis: ActionCard = {
  abilities: [
    {
      effect: {
        restriction: "cant-be-challenged",
        target: "SELF",
        type: "restriction",
      },
      id: "g4p-1",
      text: "Your characters can't be challenged until the start of your next turn.",
      type: "static",
    },
  ],
  cardNumber: 201,
  cardType: "action",
  cost: 5,
  externalIds: {
    ravensburger: "3a22bf1160fb323ece5b18abbcd5823cf6c9e990",
  },
  franchise: "Atlantis",
  id: "g4p",
  inkType: ["steel"],
  inkable: false,
  missingTests: true,
  name: "Restoring Atlantis",
  set: "007",
  text: "Your characters can't be challenged until the start of your next turn.",
};
