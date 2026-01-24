import type { ActionCard } from "@tcg/lorcana-types";

export const everybodysGotAWeakness: ActionCard = {
  id: "1cj",
  cardType: "action",
  name: "Everybody's Got a Weakness",
  inkType: ["amethyst"],
  franchise: "Hercules",
  set: "008",
  text: "Move 1 damage counter from each damaged character you have in play to chosen opposing character. Draw a card for each damage counter moved this way.",
  cost: 4,
  cardNumber: 82,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "04dc42a3175874e14d93a425a5c83f81f4275812",
  },
  abilities: [
    {
      id: "1cj-1",
      type: "action",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "play-card",
            from: "hand",
          },
          {
            type: "for-each",
            counter: {
              type: "damage-on-self",
            },
            effect: {
              type: "draw",
              amount: 1,
              target: "CONTROLLER",
            },
          },
        ],
      },
      text: "Move 1 damage counter from each damaged character you have in play to chosen opposing character. Draw a card for each damage counter moved this way.",
    },
  ],
};
