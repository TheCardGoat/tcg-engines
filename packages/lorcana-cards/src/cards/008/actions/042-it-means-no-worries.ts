import type { ActionCard } from "@tcg/lorcana-types";

export const itMeansNoWorries: ActionCard = {
  abilities: [
    {
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
      id: "i3v-1",
      text: "Sing Together 9 Return up to 3 character cards from your discard to your hand. You pay 2 {I} less for the next character you play this turn.",
      type: "action",
    },
  ],
  actionSubtype: "song",
  cardNumber: 42,
  cardType: "action",
  cost: 9,
  externalIds: {
    ravensburger: "41430a33d61146dd95a179122a74a0b04e5c2502",
  },
  franchise: "Lion King",
  id: "i3v",
  inkType: ["amber"],
  inkable: false,
  missingTests: true,
  name: "It Means No Worries",
  set: "008",
  text: "Sing Together 9 Return up to 3 character cards from your discard to your hand. You pay 2 {I} less for the next character you play this turn.",
};
