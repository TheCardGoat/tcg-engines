import type { ItemCard } from "@tcg/lorcana-types";

export const kingsSensorCore: ItemCard = {
  abilities: [
    {
      effect: {
        keyword: "Resist",
        target: "CHOSEN_CHARACTER",
        type: "gain-keyword",
        value: 1,
      },
      id: "1jp-1",
      name: "SYMBOL OF ROYALTY Your Prince and King",
      text: "SYMBOL OF ROYALTY Your Prince and King characters gain Resist +1.",
      type: "static",
    },
    {
      effect: {
        target: "CONTROLLER",
        type: "reveal-top-card",
      },
      id: "1jp-2",
      text: "ROYAL SEARCH {E}, 2 {I} – Reveal the top card of your deck. If it's a Prince or King character card, you may put that card into your hand. Otherwise, put it on the top of your deck.",
      type: "action",
    },
  ],
  cardNumber: 200,
  cardType: "item",
  cost: 3,
  externalIds: {
    ravensburger: "c8c598bbf7c1e8cecb91d6da44108cd014214d0b",
  },
  franchise: "Lorcana",
  id: "1jp",
  inkType: ["steel"],
  inkable: true,
  missingTests: true,
  name: "King's Sensor Core",
  set: "006",
  text: "SYMBOL OF ROYALTY Your Prince and King characters gain Resist +1. (Damage dealt to them is reduced by 1.)\nROYAL SEARCH {E}, 2 {I} – Reveal the top card of your deck. If it's a Prince or King character card, you may put that card into your hand. Otherwise, put it on the top of your deck.",
};
