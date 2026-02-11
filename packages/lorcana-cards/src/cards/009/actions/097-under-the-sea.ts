import type { ActionCard } from "@tcg/lorcana-types";

export const underTheSea: ActionCard = {
  abilities: [
    {
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
      id: "1se-1",
      text: "Sing Together 8 Put all opposing characters with 2 {S} or less on the bottom of their players’ decks in any order.",
      type: "action",
    },
  ],
  actionSubtype: "song",
  cardNumber: 97,
  cardType: "action",
  cost: 8,
  externalIds: {
    ravensburger: "e81fec386fd1647801df51920cfaf2d60ad090b5",
  },
  franchise: "Little Mermaid",
  id: "1se",
  inkType: ["emerald"],
  inkable: false,
  missingTests: true,
  name: "Under the Sea",
  set: "009",
  text: "Sing Together 8 Put all opposing characters with 2 {S} or less on the bottom of their players’ decks in any order.",
};
