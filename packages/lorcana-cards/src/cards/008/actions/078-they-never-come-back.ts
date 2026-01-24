import type { ActionCard } from "@tcg/lorcana-types";

export const theyNeverComeBack: ActionCard = {
  id: "d6h",
  cardType: "action",
  name: "They Never Come Back",
  inkType: ["amethyst"],
  franchise: "Pinocchio",
  set: "008",
  text: "Up to 2 chosen characters can't ready at the start of their next turn. Draw a card.",
  cost: 3,
  cardNumber: 78,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "2f80b47bf6eac6eb46a98c95ab83bdd0b6fcfc69",
  },
  abilities: [
    {
      id: "d6h-1",
      type: "action",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "restriction",
            restriction: "cant-ready",
            target: "SELF",
            duration: "until-start-of-next-turn",
          },
          {
            type: "draw",
            amount: 1,
            target: "CONTROLLER",
          },
        ],
      },
      text: "Up to 2 chosen characters can't ready at the start of their next turn. Draw a card.",
    },
  ],
};
