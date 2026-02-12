import type { ItemCard } from "@tcg/lorcana-types";

export const trainingDummy: ItemCard = {
  abilities: [
    {
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
      id: "1dj-1",
      text: "HANDLE WITH CARE {E}, 2 {I} – Chosen character gains Bodyguard until the start of your next turn.",
      type: "action",
    },
  ],
  cardNumber: 201,
  cardType: "item",
  cost: 2,
  externalIds: {
    ravensburger: "b2ffd3347d1cead4ec8b7dece53827b4b191dc01",
  },
  franchise: "Hercules",
  id: "1dj",
  inkType: ["steel"],
  inkable: true,
  missingTests: true,
  name: "Training Dummy",
  set: "006",
  text: "HANDLE WITH CARE {E}, 2 {I} – Chosen character gains Bodyguard until the start of your next turn. (An opposing character who challenges one of your characters must choose one with Bodyguard if able.)",
};
