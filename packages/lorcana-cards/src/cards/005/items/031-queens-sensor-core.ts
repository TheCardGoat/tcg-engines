import type { ItemCard } from "@tcg/lorcana-types";

export const queensSensorCore: ItemCard = {
  id: "1xk",
  cardType: "item",
  name: "Queen's Sensor Core",
  inkType: ["amber"],
  franchise: "Lorcana",
  set: "005",
  text: "SYMBOL OF NOBILITY At the start of your turn, if you have a Princess or Queen character in play, gain 1 lore.\nROYAL SEARCH {E}, 2 {I} — Reveal the top card of your deck. If it's a Princess or Queen character card, you may put it into your hand. Otherwise, put it on the top of your deck.",
  cost: 2,
  cardNumber: 31,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "fac0685879cfadc06ba4c468875041d41b0cf4ec",
  },
  abilities: [
    {
      id: "1xk-1",
      type: "action",
      effect: {
        type: "conditional",
        condition: {
          type: "if",
          expression: "you have a Princess or Queen character in play",
        },
        then: {
          type: "gain-lore",
          amount: 1,
        },
      },
      text: "SYMBOL OF NOBILITY At the start of your turn, if you have a Princess or Queen character in play, gain 1 lore.",
    },
    {
      id: "1xk-2",
      type: "activated",
      cost: { exert: true },
      effect: {
        type: "reveal-top-card",
        target: "CONTROLLER",
      },
      text: "ROYAL SEARCH {E}, 2 {I} — Reveal the top card of your deck. If it's a Princess or Queen character card, you may put it into your hand. Otherwise, put it on the top of your deck.",
    },
  ],
};
