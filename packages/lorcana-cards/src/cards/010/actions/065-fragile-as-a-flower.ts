import type { ActionCard } from "@tcg/lorcana-types";

export const fragileAsAFlower: ActionCard = {
  abilities: [
    {
      effect: {
        steps: [
          {
            amount: 1,
            target: "CONTROLLER",
            type: "draw",
          },
          {
            target: {
              cardTypes: ["character"],
              count: 1,
              owner: "any",
              selector: "chosen",
              zones: ["play"],
            },
            type: "exert",
          },
          {
            duration: "until-start-of-next-turn",
            restriction: "cant-ready",
            target: "SELF",
            type: "restriction",
          },
        ],
        type: "sequence",
      },
      id: "1im-1",
      text: "Draw a card. Exert chosen character with cost 2 or less. They can't ready at the start of their next turn.",
      type: "action",
    },
  ],
  actionSubtype: "song",
  cardNumber: 65,
  cardType: "action",
  cost: 3,
  externalIds: {
    ravensburger: "c4520386e5b3c0d4137f1da2eb502d9c3b7e6820",
  },
  franchise: "Tangled",
  id: "1im",
  inkType: ["amethyst"],
  inkable: true,
  missingTests: true,
  name: "Fragile as a Flower",
  set: "010",
  text: "Draw a card. Exert chosen character with cost 2 or less. They can't ready at the start of their next turn.",
};
