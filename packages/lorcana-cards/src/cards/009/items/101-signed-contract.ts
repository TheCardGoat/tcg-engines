import type { ItemCard } from "@tcg/lorcana-types";

export const signedContract: ItemCard = {
  id: "1y6",
  cardType: "item",
  name: "Signed Contract",
  inkType: ["emerald"],
  franchise: "Little Mermaid",
  set: "009",
  text: "FINE PRINT Whenever an opponent plays a song, you may draw a card.",
  cost: 2,
  cardNumber: 101,
  inkable: true,
  externalIds: {
    ravensburger: "fd1f3ba849d2d59ce5e0e3e8c3e3e7a146685998",
  },
  abilities: [
    {
      id: "1y6-1",
      name: "FINE PRINT",
      type: "triggered",
      trigger: {
        event: "play",
        timing: "whenever",
        on: {
          controller: "opponent",
          cardType: "action",
        },
      },
      effect: {
        type: "optional",
        effect: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
        chooser: "CONTROLLER",
      },
    },
  ],
};
