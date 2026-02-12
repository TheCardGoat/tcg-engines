import type { ItemCard } from "@tcg/lorcana-types";

export const plateArmor: ItemCard = {
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
      id: "14f-1",
      text: "WELL CRAFTED {E} — Chosen character gains Resist +2 until the start of your next turn.",
      type: "activated",
    },
  ],
  cardNumber: 201,
  cardType: "item",
  cost: 4,
  externalIds: {
    ravensburger: "915ef4e692a5bc97a06aca3c141fd01f48a150b1",
  },
  franchise: "Sword in the Stone",
  id: "14f",
  inkType: ["steel"],
  inkable: false,
  missingTests: true,
  name: "Plate Armor",
  set: "005",
  text: "WELL CRAFTED {E} — Chosen character gains Resist +2 until the start of your next turn. (Damage dealt to them is reduced by 2.)",
};
