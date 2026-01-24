import type { ItemCard } from "@tcg/lorcana-types";

export const shieldOfArendelle: ItemCard = {
  id: "rd3",
  cardType: "item",
  name: "Shield of Arendelle",
  inkType: ["steel"],
  franchise: "Frozen",
  set: "005",
  text: "DEFLECT Banish this item — Chosen character gains Resist +1 until the start of your next turn. (Damage dealt to them is reduced by 1.)",
  cost: 1,
  cardNumber: 200,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "629ec024c2e311b02a232a0ba846ef924eb73d12",
  },
  abilities: [
    {
      id: "rd3-1",
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
        value: 1,
      },
      text: "DEFLECT Banish this item — Chosen character gains Resist +1 until the start of your next turn.",
    },
  ],
};
