import type { ActionCard } from "@tcg/lorcana-types";

export const magicalAid: ActionCard = {
  abilities: [
    {
      effect: {
        steps: [
          {
            keyword: "Challenger",
            target: {
              selector: "chosen",
              count: 1,
              owner: "any",
              zones: ["play"],
              cardTypes: ["character"],
            },
            type: "gain-keyword",
            value: 3,
          },
          {
            target: "SELF",
            type: "return-to-hand",
          },
        ],
        type: "sequence",
      },
      id: "6tm-1",
      text: "Chosen character gains Challenger +3 and “When this character is banished in a challenge, return this card to your hand” this turn.",
      type: "action",
    },
  ],
  cardNumber: 63,
  cardType: "action",
  cost: 3,
  externalIds: {
    ravensburger: "18972399651ab2488a78e778fd0a9da89decc429",
  },
  franchise: "Aladdin",
  id: "6tm",
  inkType: ["amethyst"],
  inkable: true,
  missingTests: true,
  name: "Magical Aid",
  set: "005",
  text: "Chosen character gains Challenger +3 and “When this character is banished in a challenge, return this card to your hand” this turn. (They get +3 {S} while challenging.)",
};
