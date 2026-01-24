import type { ActionCard } from "@tcg/lorcana-types";

export const magicalAid: ActionCard = {
  id: "6tm",
  cardType: "action",
  name: "Magical Aid",
  inkType: ["amethyst"],
  franchise: "Aladdin",
  set: "005",
  text: "Chosen character gains Challenger +3 and “When this character is banished in a challenge, return this card to your hand” this turn. (They get +3 {S} while challenging.)",
  cost: 3,
  cardNumber: 63,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "18972399651ab2488a78e778fd0a9da89decc429",
  },
  abilities: [
    {
      id: "6tm-1",
      type: "action",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "gain-keyword",
            keyword: "Challenger",
            target: {
              selector: "chosen",
              count: 1,
              owner: "any",
              zones: ["play"],
              cardTypes: ["character"],
            },
            value: 3,
          },
          {
            type: "return-to-hand",
            target: "SELF",
          },
        ],
      },
      text: "Chosen character gains Challenger +3 and “When this character is banished in a challenge, return this card to your hand” this turn.",
    },
  ],
};
