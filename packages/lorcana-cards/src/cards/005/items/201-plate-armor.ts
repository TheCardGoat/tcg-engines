import type { ItemCard } from "@tcg/lorcana-types";

export const plateArmor: ItemCard = {
  id: "14f",
  cardType: "item",
  name: "Plate Armor",
  inkType: ["steel"],
  franchise: "Sword in the Stone",
  set: "005",
  text: "WELL CRAFTED {E} — Chosen character gains Resist +2 until the start of your next turn. (Damage dealt to them is reduced by 2.)",
  cost: 4,
  cardNumber: 201,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "915ef4e692a5bc97a06aca3c141fd01f48a150b1",
  },
  abilities: [
    {
      id: "14f-1",
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
      text: "WELL CRAFTED {E} — Chosen character gains Resist +2 until the start of your next turn.",
    },
  ],
};
