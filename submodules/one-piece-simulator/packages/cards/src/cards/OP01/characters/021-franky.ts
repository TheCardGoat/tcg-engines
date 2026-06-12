import type { CharacterCard } from "@tcg/op-types";
import { op01Franky021I18n } from "./021-franky.i18n.ts";

export const op01Franky021: CharacterCard = {
  id: "OP01-021",
  cardType: "character",
  color: ["red"],
  rarity: "UC",
  setId: "OP01",
  cost: 3,
  power: 4000,
  traits: ["Straw Hat Crew"],
  attribute: "ranged",
  effect: "[DON!! x1] This Character can also attack your opponent's active Characters.",
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
            action: "canAttackActive",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: op01Franky021I18n,
};
