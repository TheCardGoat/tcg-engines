import type { ActionCard } from "@tcg/lorcana-types";

export const loseTheWay: ActionCard = {
  id: "1um",
  cardType: "action",
  name: "Lose the Way",
  inkType: ["amethyst"],
  franchise: "Alice in Wonderland",
  set: "006",
  text: "Exert chosen character. Then, you may choose and discard a card. If you do, the exerted character can't ready at the start of their next turn.",
  cost: 2,
  cardNumber: 63,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "efd47478baf36aa353f4ec8a99d33cc331c1b1f6",
  },
  abilities: [
    {
      id: "1um-1",
      type: "action",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "optional",
            effect: {
              type: "discard",
              amount: 1,
              target: "CONTROLLER",
              chosen: true,
            },
            chooser: "CONTROLLER",
          },
          {
            type: "restriction",
            restriction: "cant-ready",
            target: "SELF",
            duration: "until-start-of-next-turn",
          },
        ],
      },
      text: "Exert chosen character. Then, you may choose and discard a card. If you do, the exerted character can't ready at the start of their next turn.",
    },
  ],
};
