import type { ItemCard } from "@tcg/lorcana-types";

export const atlanteanCrystal: ItemCard = {
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
        value: 2,
      },
      id: "1y7-1",
      text: "SHIELDING LIGHT {E}, 2 {I} — Chosen character gains Resist +2 and Support until the start of your next turn.",
      type: "activated",
    },
  ],
  cardNumber: 180,
  cardType: "item",
  cost: 2,
  externalIds: {
    ravensburger: "fe914af5333fd24dcec411e67a9a6c5f596db9df",
  },
  franchise: "Atlantis",
  id: "1y7",
  inkType: ["sapphire"],
  inkable: true,
  missingTests: true,
  name: "Atlantean Crystal",
  set: "008",
  text: "SHIELDING LIGHT {E}, 2 {I} — Chosen character gains Resist +2 and Support until the start of your next turn. (Damage dealt to them is reduced by 2. Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)",
};
