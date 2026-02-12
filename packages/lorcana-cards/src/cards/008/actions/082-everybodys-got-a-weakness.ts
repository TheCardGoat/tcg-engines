import type { ActionCard } from "@tcg/lorcana-types";

export const everybodysGotAWeakness: ActionCard = {
  abilities: [
    {
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
      id: "1cj-1",
      text: "Move 1 damage counter from each damaged character you have in play to chosen opposing character. Draw a card for each damage counter moved this way.",
      type: "action",
    },
  ],
  cardNumber: 82,
  cardType: "action",
  cost: 4,
  externalIds: {
    ravensburger: "04dc42a3175874e14d93a425a5c83f81f4275812",
  },
  franchise: "Hercules",
  id: "1cj",
  inkType: ["amethyst"],
  inkable: true,
  missingTests: true,
  name: "Everybody's Got a Weakness",
  set: "008",
  text: "Move 1 damage counter from each damaged character you have in play to chosen opposing character. Draw a card for each damage counter moved this way.",
};
