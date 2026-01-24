import type { ActionCard } from "@tcg/lorcana-types";

export const puttingItAllTogether: ActionCard = {
  id: "1du",
  cardType: "action",
  name: "Putting It All Together",
  inkType: ["steel"],
  franchise: "Zootropolis",
  set: "010",
  text: "Chosen opposing character can't challenge during their next turn. Draw a card.",
  cost: 2,
  cardNumber: 196,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "b33e8cb6e3bd48c4ba843a6e1f9a62094435ba7b",
  },
  abilities: [
    {
      id: "1du-1",
      type: "action",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "restriction",
            restriction: "cant-challenge",
            target: "SELF",
          },
          {
            type: "draw",
            amount: 1,
            target: "CONTROLLER",
          },
        ],
      },
      text: "Chosen opposing character can't challenge during their next turn. Draw a card.",
    },
  ],
};
