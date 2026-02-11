import type { ItemCard } from "@tcg/lorcana-types";

export const queensSensorCore: ItemCard = {
  abilities: [
    {
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
      id: "1xk-1",
      text: "SYMBOL OF NOBILITY At the start of your turn, if you have a Princess or Queen character in play, gain 1 lore.",
      type: "action",
    },
    {
      cost: { exert: true },
      effect: {
        type: "reveal-top-card",
        target: "CONTROLLER",
      },
      id: "1xk-2",
      text: "ROYAL SEARCH {E}, 2 {I} — Reveal the top card of your deck. If it's a Princess or Queen character card, you may put it into your hand. Otherwise, put it on the top of your deck.",
      type: "activated",
    },
  ],
  cardNumber: 31,
  cardType: "item",
  cost: 2,
  externalIds: {
    ravensburger: "fac0685879cfadc06ba4c468875041d41b0cf4ec",
  },
  franchise: "Lorcana",
  id: "1xk",
  inkType: ["amber"],
  inkable: true,
  missingTests: true,
  name: "Queen's Sensor Core",
  set: "005",
  text: "SYMBOL OF NOBILITY At the start of your turn, if you have a Princess or Queen character in play, gain 1 lore.\nROYAL SEARCH {E}, 2 {I} — Reveal the top card of your deck. If it's a Princess or Queen character card, you may put it into your hand. Otherwise, put it on the top of your deck.",
};
