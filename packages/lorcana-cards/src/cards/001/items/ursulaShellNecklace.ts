import type { ItemCard } from "@tcg/lorcana-types";

export const ursulaundefined: ItemCard = {
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
      id: "nba-1",
      text: "**NOW, SING!** Whenever you play a song, you may pay 1 {I} to draw a card.",
      type: "action",
    },
  ],
  cardNumber: 34,
  cardType: "item",
  cost: 3,
  externalIds: {
    ravensburger: "",
  },
  franchise: "Disney",
  fullName: "Ursula - undefined",
  id: "nba",
  inkType: ["amber"],
  inkable: true,
  name: "Ursula",
  set: "001",
  text: "**NOW, SING!** Whenever you play a song, you may pay 1 {I} to draw a card.",
  version: "undefined",
};
