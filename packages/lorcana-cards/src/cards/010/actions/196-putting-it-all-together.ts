import type { ActionCard } from "@tcg/lorcana-types";

export const puttingItAllTogether: ActionCard = {
  abilities: [
    {
      effect: {
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
        type: "sequence",
      },
      id: "1du-1",
      text: "Chosen opposing character can't challenge during their next turn. Draw a card.",
      type: "action",
    },
  ],
  cardNumber: 196,
  cardType: "action",
  cost: 2,
  externalIds: {
    ravensburger: "b33e8cb6e3bd48c4ba843a6e1f9a62094435ba7b",
  },
  franchise: "Zootropolis",
  id: "1du",
  inkType: ["steel"],
  inkable: true,
  missingTests: true,
  name: "Putting It All Together",
  set: "010",
  text: "Chosen opposing character can't challenge during their next turn. Draw a card.",
};
