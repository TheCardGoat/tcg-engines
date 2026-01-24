import type { ActionCard } from "@tcg/lorcana-types";

export const fragileAsAFlower: ActionCard = {
  id: "1im",
  cardType: "action",
  name: "Fragile as a Flower",
  inkType: ["amethyst"],
  franchise: "Tangled",
  set: "010",
  text: "Draw a card. Exert chosen character with cost 2 or less. They can't ready at the start of their next turn.",
  actionSubtype: "song",
  cost: 3,
  cardNumber: 65,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "c4520386e5b3c0d4137f1da2eb502d9c3b7e6820",
  },
  abilities: [
    {
      id: "1im-1",
      type: "action",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "draw",
            amount: 1,
            target: "CONTROLLER",
          },
          {
            type: "exert",
            target: {
              selector: "chosen",
              count: 1,
              owner: "any",
              zones: ["play"],
              cardTypes: ["character"],
            },
          },
          {
            type: "restriction",
            restriction: "cant-ready",
            target: "SELF",
            duration: "until-start-of-next-turn",
          },
        ],
      },
      text: "Draw a card. Exert chosen character with cost 2 or less. They can't ready at the start of their next turn.",
    },
  ],
};
