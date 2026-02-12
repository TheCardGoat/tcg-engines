import type { ActionCard } from "@tcg/lorcana-types";

export const forestDuel: ActionCard = {
  abilities: [
    {
      effect: {
        type: "sequence",
        steps: [
          {
            type: "gain-keyword",
            keyword: "Challenger",
            target: "YOUR_CHARACTERS",
            value: 2,
          },
          {
            type: "return-to-hand",
            target: "SELF",
          },
        ],
      },
      id: "12g-1",
      text: 'Your characters gain Challenger +2 and "When this character is banished in a challenge, return this card to your hand" this turn.',
      type: "static",
    },
  ],
  cardNumber: 77,
  cardType: "action",
  cost: 5,
  externalIds: {
    ravensburger: "8a8fd5b953941634d5c3675e46824ff56ce8b084",
  },
  franchise: "Bambi",
  id: "12g",
  inkType: ["amethyst"],
  inkable: true,
  missingTests: true,
  name: "Forest Duel",
  set: "008",
  text: 'Your characters gain Challenger +2 and "When this character is banished in a challenge, return this card to your hand" this turn. (They get +2 {S} while challenging.)',
};
