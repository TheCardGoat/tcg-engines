import type { ItemCard } from "@tcg/lorcana-types";

export const kingsSensorCore: ItemCard = {
  id: "1jp",
  cardType: "item",
  name: "King's Sensor Core",
  inkType: ["steel"],
  franchise: "Lorcana",
  set: "006",
  text: "SYMBOL OF ROYALTY Your Prince and King characters gain Resist +1. (Damage dealt to them is reduced by 1.)\nROYAL SEARCH {E}, 2 {I} – Reveal the top card of your deck. If it's a Prince or King character card, you may put that card into your hand. Otherwise, put it on the top of your deck.",
  cost: 3,
  cardNumber: 200,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "c8c598bbf7c1e8cecb91d6da44108cd014214d0b",
  },
  abilities: [],
};
