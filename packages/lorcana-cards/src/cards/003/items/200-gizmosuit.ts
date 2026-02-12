import type { ItemCard } from "@tcg/lorcana-types";

export const gizmosuit: ItemCard = {
  abilities: [
    {
      cost: { exert: true },
      effect: {
        keyword: "Resist",
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
        type: "gain-keyword",
        value: 2,
      },
      id: "1ip-1",
      text: "CYBERNETIC ARMOR Banish this item — Chosen character gains Resist +2 until the start of your next turn.",
      type: "activated",
    },
  ],
  cardNumber: 200,
  cardType: "item",
  cost: 3,
  externalIds: {
    ravensburger: "c52fabcec115b588f6fb5dd2bbc1529632fb8b72",
  },
  franchise: "Ducktales",
  id: "1ip",
  inkType: ["steel"],
  inkable: true,
  missingTests: true,
  name: "Gizmosuit",
  set: "003",
  text: "CYBERNETIC ARMOR Banish this item — Chosen character gains Resist +2 until the start of your next turn. (Damage dealt to them is reduced by 2.)",
};
