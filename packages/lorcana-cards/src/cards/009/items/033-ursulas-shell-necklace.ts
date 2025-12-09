import type { ItemCard } from "@tcg/lorcana";

export const ursulasShellNecklace: ItemCard = {
  id: "xg1",
  cardType: "item",
  name: "Ursula’s Shell Necklace",
  inkType: ["amber"],
  franchise: "Little Mermaid",
  set: "009",
  text: "NOW, SING! Whenever you play a song, you may pay 1 {I} to draw a card.",
  cost: 3,
  cardNumber: 33,
  inkable: false,
  externalIds: {
    ravensburger: "788d367996da4e38abe1f058df4a45990215968f",
  },
  abilities: [
    {
      id: "xg1-1",
      text: "NOW, SING! Whenever you play a song, you may pay 1 {I} to draw a card.",
      name: "NOW, SING!",
      type: "triggered",
      trigger: {
        event: "play",
        timing: "whenever",
        on: {
          controller: "you",
          cardType: "song",
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
