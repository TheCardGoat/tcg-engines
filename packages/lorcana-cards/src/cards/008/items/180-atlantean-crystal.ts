import type { ItemCard } from "@tcg/lorcana-types";

export const atlanteanCrystal: ItemCard = {
  id: "1y7",
  cardType: "item",
  name: "Atlantean Crystal",
  inkType: ["sapphire"],
  franchise: "Atlantis",
  set: "008",
  text: "SHIELDING LIGHT {E}, 2 {I} — Chosen character gains Resist +2 and Support until the start of your next turn. (Damage dealt to them is reduced by 2. Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)",
  cost: 2,
  cardNumber: 180,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "fe914af5333fd24dcec411e67a9a6c5f596db9df",
  },
  abilities: [
    {
      id: "1y7-1",
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
        value: 2,
      },
      text: "SHIELDING LIGHT {E}, 2 {I} — Chosen character gains Resist +2 and Support until the start of your next turn.",
    },
  ],
};
