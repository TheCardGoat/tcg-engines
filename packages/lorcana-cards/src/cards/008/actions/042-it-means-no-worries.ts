import type { ActionCard } from "@tcg/lorcana-types";

export const itMeansNoWorries: ActionCard = {
  id: "i3v",
  cardType: "action",
  name: "It Means No Worries",
  inkType: ["amber"],
  franchise: "Lion King",
  set: "008",
  text: "Sing Together 9 Return up to 3 character cards from your discard to your hand. You pay 2 {I} less for the next character you play this turn.",
  actionSubtype: "song",
  cost: 9,
  cardNumber: 42,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "41430a33d61146dd95a179122a74a0b04e5c2502",
  },
  abilities: [
    {
      id: "i3v-1",
      type: "action",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "return-to-hand",
            target: {
              selector: "chosen",
              count: 1,
              owner: "any",
              zones: ["play"],
              cardTypes: ["character"],
            },
          },
          {
            type: "play-card",
            from: "hand",
          },
        ],
      },
      text: "Sing Together 9 Return up to 3 character cards from your discard to your hand. You pay 2 {I} less for the next character you play this turn.",
    },
  ],
};
