import type { ItemCard } from "@tcg/lorcana-types";
import { airfoilI18n } from "./097-airfoil.i18n";

export const airfoil: ItemCard = {
  id: "L6c",
  canonicalId: "ci_L6c",
  reprints: ["set3-097"],
  cardType: "item",
  name: "Airfoil",
  inkType: ["emerald"],
  franchise: "Talespin",
  set: "003",
  cardNumber: 97,
  rarity: "common",
  cost: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_bb11d0da1233459c84ade5157719208f",
    tcgPlayer: 537757,
  },
  text: [
    {
      title: "I GOT TO BE GOING",
      description: "{E} — If you've played 2 or more actions this turn, draw a card.",
    },
  ],
  abilities: [
    {
      id: "1kp-1",
      cost: {
        exert: true,
      },
      condition: {
        type: "turn-metric",
        metric: "played-actions",
        comparison: {
          operator: "gte",
          value: 2,
        },
      },
      effect: {
        amount: 1,
        target: "CONTROLLER",
        type: "draw",
      },
      type: "activated",
      name: "I GOT TO BE GOING",
      text: "I GOT TO BE GOING {E} — If you've played 2 or more actions this turn, draw a card.",
    },
  ],
  i18n: airfoilI18n,
};
