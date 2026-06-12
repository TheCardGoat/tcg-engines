import type { CharacterCard } from "@tcg/op-types";
import { op08XDrake093I18n } from "./093-x-drake.i18n.ts";

export const op08XDrake093: CharacterCard = {
  id: "OP08-093",
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
