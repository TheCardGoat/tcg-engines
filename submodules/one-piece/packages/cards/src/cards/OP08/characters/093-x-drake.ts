import type { CharacterCard } from "@tcg/op-types";
import { op08XDrake093I18n } from "./093-x-drake.i18n.ts";

export const op08XDrake093: CharacterCard = {
  id: "OP08-093",
  canonicalId: "OP08-093",
  slug: "x-drake/op08-093",
  name: "X.Drake",
  printings: [
    {
      id: "OP08-093",
      artId: "OP08-093",
      setCode: "OP08",
      collectorNumber: "093",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP08-093.jpg",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "OP08",
  cost: 4,
  power: 6000,
  traits: ["Animal Kingdom Pirates Drake Pirates Navy"],
  attribute: "slash",
  effect: "[DON!! x1] This Character gains +2 cost.",
  effects: {
    permanentEffects: [
      {
        conditions: [
          {
            condition: "donAttached",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "modifyCost",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            value: 2,
          },
        ],
      },
    ],
  },
  i18n: op08XDrake093I18n,
};
