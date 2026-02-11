import type { ActionCard } from "@tcg/lorcana-types";

export const theyNeverComeBack: ActionCard = {
  abilities: [
    {
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
      id: "d6h-1",
      text: "Up to 2 chosen characters can't ready at the start of their next turn. Draw a card.",
      type: "action",
    },
  ],
  cardNumber: 78,
  cardType: "action",
  cost: 3,
  externalIds: {
    ravensburger: "2f80b47bf6eac6eb46a98c95ab83bdd0b6fcfc69",
  },
  franchise: "Pinocchio",
  id: "d6h",
  inkType: ["amethyst"],
  inkable: true,
  missingTests: true,
  name: "They Never Come Back",
  set: "008",
  text: "Up to 2 chosen characters can't ready at the start of their next turn. Draw a card.",
};
