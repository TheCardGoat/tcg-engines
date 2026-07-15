import type { ActionCard } from "@tcg/lorcana-types";

export const weveGotCompany: ActionCard = {
  abilities: [
    {
      effect: {
        steps: [
          {
            target: "YOUR_CHARACTERS",
            type: "ready",
          },
          {
            duration: "this-turn",
            keyword: "Reckless",
            target: "CHOSEN_CHARACTER",
            type: "gain-keyword",
          },
        ],
        type: "sequence",
      },
      id: "inc-1",
      text: "Ready all your characters. They gain Reckless this turn.",
      type: "action",
    },
  ],
  cardNumber: 147,
  cardType: "action",
  cost: 3,
  externalIds: {
    ravensburger: "43362114455febd0d8b29de9e69a7c4841fd2ec7",
  },
  franchise: "Atlantis",
  id: "inc",
  inkType: ["ruby"],
  inkable: false,
  missingTests: true,
  name: "We've Got Company!",
  set: "007",
  text: "Ready all your characters. They gain Reckless this turn. (They can't quest and must challenge if able.)",
};
