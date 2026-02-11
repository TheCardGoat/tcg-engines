import type { ItemCard } from "@tcg/lorcana-types";

export const detectivesBadge: ItemCard = {
  abilities: [
    {
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
      id: "rkh-1",
      text: "PROTECT AND SERVE {E}, 1 {I} — Chosen character gains Resist +1 and the Detective classification until the start of your next turn.",
      type: "activated",
    },
  ],
  cardNumber: 166,
  cardType: "item",
  cost: 1,
  externalIds: {
    ravensburger: "635ca4612e1170dd6d1322b767873b0866c408c2",
  },
  franchise: "Zootropolis",
  id: "rkh",
  inkType: ["sapphire"],
  inkable: true,
  missingTests: true,
  name: "Detective's Badge",
  set: "010",
  text: "PROTECT AND SERVE {E}, 1 {I} — Chosen character gains Resist +1 and the Detective classification until the start of your next turn. (Damage dealt to them is reduced by 1.)",
};
