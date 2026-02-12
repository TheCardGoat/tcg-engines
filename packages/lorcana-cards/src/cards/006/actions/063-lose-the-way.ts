import type { ActionCard } from "@tcg/lorcana-types";

export const loseTheWay: ActionCard = {
  abilities: [
    {
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
      id: "1um-1",
      text: "Exert chosen character. Then, you may choose and discard a card. If you do, the exerted character can't ready at the start of their next turn.",
      type: "action",
    },
  ],
  cardNumber: 63,
  cardType: "action",
  cost: 2,
  externalIds: {
    ravensburger: "efd47478baf36aa353f4ec8a99d33cc331c1b1f6",
  },
  franchise: "Alice in Wonderland",
  id: "1um",
  inkType: ["amethyst"],
  inkable: true,
  missingTests: true,
  name: "Lose the Way",
  set: "006",
  text: "Exert chosen character. Then, you may choose and discard a card. If you do, the exerted character can't ready at the start of their next turn.",
};
