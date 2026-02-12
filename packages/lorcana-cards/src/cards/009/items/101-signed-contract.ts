import type { ItemCard } from "@tcg/lorcana-types";

export const signedContract: ItemCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
        type: "optional",
      },
      id: "1y6-1",
      name: "FINE PRINT",
      text: "FINE PRINT Whenever an opponent plays a song, you may draw a card.",
      trigger: {
        event: "play",
        on: {
          controller: "opponent",
          cardType: "action",
        },
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  cardNumber: 101,
  cardType: "item",
  cost: 2,
  externalIds: {
    ravensburger: "fd1f3ba849d2d59ce5e0e3e8c3e3e7a146685998",
  },
  franchise: "Little Mermaid",
  id: "1y6",
  inkType: ["emerald"],
  inkable: true,
  name: "Signed Contract",
  set: "009",
  text: "FINE PRINT Whenever an opponent plays a song, you may draw a card.",
};
