import type { ItemCard } from "@tcg/lorcana-types";

export const ursulasShellNecklace: ItemCard = {
  abilities: [
    {
      effect: {
        type: "optional",
        effect: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
        chooser: "CONTROLLER",
      },
      id: "xg1-1",
      name: "NOW, SING!",
      text: "NOW, SING! Whenever you play a song, you may pay 1 to draw a card.",
      trigger: {
        event: "play",
        timing: "whenever",
        on: {
          controller: "you",
          cardType: "song",
        },
      },
      type: "triggered",
    },
  ],
  cardNumber: 33,
  cardType: "item",
  cost: 3,
  externalIds: {
    ravensburger: "788d367996da4e38abe1f058df4a45990215968f",
  },
  franchise: "Little Mermaid",
  id: "xg1",
  inkType: ["amber"],
  inkable: false,
  name: "Ursula’s Shell Necklace",
  set: "009",
  text: "NOW, SING! Whenever you play a song, you may pay 1 to draw a card.",
};
