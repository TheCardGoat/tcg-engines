import type { ActionCard } from "@tcg/lorcana-types";

export const forestDuel: ActionCard = {
  id: "12g",
  cardType: "action",
  name: "Forest Duel",
  inkType: ["amethyst"],
  franchise: "Bambi",
  set: "008",
  text: 'Your characters gain Challenger +2 and "When this character is banished in a challenge, return this card to your hand" this turn. (They get +2 {S} while challenging.)',
  cost: 5,
  cardNumber: 77,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "8a8fd5b953941634d5c3675e46824ff56ce8b084",
  },
  abilities: [
    {
      id: "12g-1",
      type: "static",
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
      text: 'Your characters gain Challenger +2 and "When this character is banished in a challenge, return this card to your hand" this turn.',
    },
  ],
};
