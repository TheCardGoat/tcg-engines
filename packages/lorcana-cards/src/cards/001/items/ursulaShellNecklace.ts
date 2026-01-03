import type { ItemCard } from "@tcg/lorcana-types";

export const UrsulaUndefined: ItemCard = {
  id: "nba",
  cardType: "item",
  name: "Ursula",
  version: "undefined",
  fullName: "Ursula - undefined",
  inkType: ["amber"],
  franchise: "Disney",
  set: "001",
  text: "**NOW, SING!** Whenever you play a song, you may pay 1 {I} to draw a card.",
  cost: 3,
  cardNumber: 34,
  inkable: true,
  externalIds: {
    ravensburger: "",
  },
  abilities: [
    {
      type: "action",
      text: "**NOW, SING!** Whenever you play a song, you may pay 1 {I} to draw a card.",
      id: "nba-1",
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
