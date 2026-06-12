import type { CharacterCard } from "@tcg/op-types";
import { op02WhiteyBay014I18n } from "./014-whitey-bay.i18n.ts";

export const op02WhiteyBay014: CharacterCard = {
  id: "OP02-014",
  cardType: "character",
  color: ["red"],
  rarity: "UC",
  setId: "OP02",
  cost: 1,
  power: 2000,
  counter: 1000,
  traits: ["Whitebeard Pirates Allies"],
  attribute: "slash",
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
  i18n: op02WhiteyBay014I18n,
};
