import type { CharacterCard } from "@tcg/op-types";
import { op15Ohm061I18n } from "./op15-061-ohm.i18n.ts";

export const op15Ohm061: CharacterCard = {
  id: "OP15-061",
  canonicalId: "OP15-061",
  slug: "ohm/op15-061",
  name: "Ohm",
  printings: [
    {
      id: "OP15-061",
      artId: "OP15-061",
      setCode: "OP15",
      collectorNumber: "061",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP15-061_NMfOXtx.jpg",
    },
    {
      id: "OP15-061_p1",
      artId: "OP15-061_p1",
      setCode: "OP15",
      collectorNumber: "061",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP15-061_p1_NbJVL96.jpg",
      label: "Ohm (Alternate Art)",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "R",
  setId: "OP15",
  cost: 1,
  power: 2000,
  counter: 1000,
  traits: ["Sky Island Vassals"],
  attribute: "slash",
  effect:
    "[On Play] DON!! -1: Draw 1 card.\n[When Attacking] If you have 6 or less DON!! cards on your field, give up to 1 of your opponent's Characters -1000 power during this turn.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "returnDon",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
        ],
        optional: true,
      },
      {
        trigger: "whenAttacking",
        conditions: [
          {
            condition: "donFieldCount",
            player: "self",
            comparison: "lte",
            value: 6,
          },
        ],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: -1000,
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: op15Ohm061I18n,
};
