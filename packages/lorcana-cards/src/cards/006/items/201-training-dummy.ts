import type { ItemCard } from "@tcg/lorcana-types";

export const trainingDummy: ItemCard = {
  id: "1dj",
  cardType: "item",
  name: "Training Dummy",
  inkType: ["steel"],
  franchise: "Hercules",
  set: "006",
  text: "HANDLE WITH CARE {E}, 2 {I} – Chosen character gains Bodyguard until the start of your next turn. (An opposing character who challenges one of your characters must choose one with Bodyguard if able.)",
  cost: 2,
  cardNumber: 201,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "b2ffd3347d1cead4ec8b7dece53827b4b191dc01",
  },
  abilities: [
    {
      id: "1dj-1",
      type: "action",
      effect: {
        type: "gain-keyword",
        keyword: "Bodyguard",
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
      text: "HANDLE WITH CARE {E}, 2 {I} – Chosen character gains Bodyguard until the start of your next turn.",
    },
  ],
};
