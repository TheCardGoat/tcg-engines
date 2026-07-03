import type { ItemCard } from "@tcg/lorcana-types";
import { plungerCrossbowI18n } from "./200-plunger-crossbow.i18n";

export const plungerCrossbow: ItemCard = {
  id: "4pA",
  canonicalId: "ci_4pA",
  slug: "lorcana-ci_4pA",
  printings: [
    {
      id: "set12-200",
      artId: "set12-200",
      setCode: "set12",
      collectorNumber: "200",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set12-200"],
  cardType: "item",
  name: "Plunger Crossbow",
  inkType: ["steel"],
  franchise: "Rescue Rangers",
  set: "012",
  cardNumber: 200,
  rarity: "common",
  cost: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_3d1982b9cb5d4ed0bae53c2db2c92fd8",
    tcgPlayer: "690723",
  },
  text: [
    {
      title: "SUCTION TECHNOLOGY",
      description: "{E}, 2 {I} — Draw a card, then choose and discard a card.",
    },
  ],
  abilities: [
    {
      id: "4pA-1",
      name: "SUCTION TECHNOLOGY",
      type: "activated",
      cost: {
        exert: true,
        ink: 2,
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "draw",
            amount: 1,
            target: "CONTROLLER",
          },
          {
            type: "discard",
            amount: 1,
            chosen: true,
            from: "hand",
            target: "CONTROLLER",
          },
        ],
      },
      text: "SUCTION TECHNOLOGY {E}, 2 {I} — Draw a card, then choose and discard a card.",
    },
  ],
  i18n: plungerCrossbowI18n,
};
