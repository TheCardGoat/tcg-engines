import type { ItemCard } from "@tcg/lorcana-types";

export const shieldOfArendelle: ItemCard = {
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
      id: "rd3-1",
      text: "DEFLECT Banish this item — Chosen character gains Resist +1 until the start of your next turn.",
      type: "activated",
    },
  ],
  cardNumber: 200,
  cardType: "item",
  cost: 1,
  externalIds: {
    ravensburger: "629ec024c2e311b02a232a0ba846ef924eb73d12",
  },
  franchise: "Frozen",
  id: "rd3",
  inkType: ["steel"],
  inkable: true,
  missingTests: true,
  name: "Shield of Arendelle",
  set: "005",
  text: "DEFLECT Banish this item — Chosen character gains Resist +1 until the start of your next turn. (Damage dealt to them is reduced by 1.)",
};
