import type { ItemCard } from "@tcg/lorcana-types";

export const gizmosuit: ItemCard = {
  id: "1ip",
  cardType: "item",
  name: "Gizmosuit",
  inkType: ["steel"],
  franchise: "Ducktales",
  set: "003",
  text: "CYBERNETIC ARMOR Banish this item — Chosen character gains Resist +2 until the start of your next turn. (Damage dealt to them is reduced by 2.)",
  cost: 3,
  cardNumber: 200,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "c52fabcec115b588f6fb5dd2bbc1529632fb8b72",
  },
  abilities: [
    {
      id: "1ip-1",
      type: "activated",
      effect: {
        type: "gain-keyword",
        keyword: "Resist",
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
        value: 2,
      },
      text: "CYBERNETIC ARMOR Banish this item — Chosen character gains Resist +2 until the start of your next turn.",
    },
  ],
};
