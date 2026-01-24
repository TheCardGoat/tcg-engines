import type { ItemCard } from "@tcg/lorcana-types";

export const mouseArmor: ItemCard = {
  id: "1as",
  cardType: "item",
  name: "Mouse Armor",
  inkType: ["steel"],
  franchise: "Great Mouse Detective",
  set: "002",
  text: "PROTECTION {E} — Chosen character gains Resist +1 until the start of your next turn. (Damage dealt to them is reduced by 1.)",
  cost: 2,
  cardNumber: 203,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "a8a678ce1ce9ad4855ef12e449fae23cb97cb0ff",
  },
  abilities: [
    {
      id: "1as-1",
      type: "activated",
      cost: { exert: true },
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
        value: 1,
      },
      text: "PROTECTION {E} — Chosen character gains Resist +1 until the start of your next turn.",
    },
  ],
};
