import type { ActionCard } from "@tcg/lorcana-types";

export const underTheSea: ActionCard = {
  id: "1se",
  cardType: "action",
  name: "Under the Sea",
  inkType: ["emerald"],
  franchise: "Little Mermaid",
  set: "009",
  text: "Sing Together 8 Put all opposing characters with 2 {S} or less on the bottom of their players’ decks in any order.",
  actionSubtype: "song",
  cost: 8,
  cardNumber: 97,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "e81fec386fd1647801df51920cfaf2d60ad090b5",
  },
  abilities: [
    {
      id: "1se-1",
      type: "action",
      effect: {
        type: "put-on-bottom",
        target: {
          selector: "all",
          count: "all",
          owner: "opponent",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
      text: "Sing Together 8 Put all opposing characters with 2 {S} or less on the bottom of their players’ decks in any order.",
    },
  ],
};
