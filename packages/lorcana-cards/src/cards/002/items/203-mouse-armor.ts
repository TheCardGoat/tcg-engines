import type { ItemCard } from "@tcg/lorcana-types";

export const mouseArmor: ItemCard = {
  abilities: [
    {
      cost: { exert: true },
      effect: {
        keyword: "Resist",
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "gain-keyword",
        value: 1,
      },
      id: "1as-1",
      text: "PROTECTION {E} — Chosen character gains Resist +1 until the start of your next turn.",
      type: "activated",
    },
  ],
  cardNumber: 203,
  cardType: "item",
  cost: 2,
  externalIds: {
    ravensburger: "a8a678ce1ce9ad4855ef12e449fae23cb97cb0ff",
  },
  franchise: "Great Mouse Detective",
  id: "1as",
  inkType: ["steel"],
  inkable: false,
  missingTests: true,
  name: "Mouse Armor",
  set: "002",
  text: "PROTECTION {E} — Chosen character gains Resist +1 until the start of your next turn. (Damage dealt to them is reduced by 1.)",
};
