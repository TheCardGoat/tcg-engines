import type { CharacterCard } from "@tcg/op-types";
import { op16EdwardNewgate003I18n } from "./op16-003-edward-newgate.i18n.ts";

export const op16EdwardNewgate003: CharacterCard = {
  id: "OP16-003",
  canonicalId: "OP16-003",
  slug: "edward-newgate/op16-003",
  name: "Edward.Newgate",
  printings: [
    {
      id: "OP16-003",
      artId: "OP16-003",
      setCode: "OP16",
      collectorNumber: "003",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP16-003_e0anQQi.jpg",
    },
    {
      id: "OP16-003_p1",
      artId: "OP16-003_p1",
      setCode: "OP16",
      collectorNumber: "003",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP16-003_p1_cgS2L6U.jpg",
      label: "Edward.Newgate (Alternate Art)",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "SR",
  setId: "OP16",
  cost: 8,
  power: 10000,
  traits: ["Whitebeard Pirates"],
  attribute: "special",
  effect:
    "[Your Turn] Your Leader gains [Double Attack] and +2000 power. [On Play] You may reveal 2 Character cards with 8000 power from your hand: Give up to 1 of your opponent's Characters -6000 power during this turn.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "revealFromHand",
            amount: 2,
            filters: [
              {
                filter: "cardCategory",
                value: "character",
              },
              {
                filter: "power",
                comparison: "eq",
                value: 8000,
              },
            ],
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
            value: -6000,
            duration: "thisTurn",
          },
        ],
        optional: true,
      },
    ],
    permanentEffects: [
      {
        conditions: [
          {
            condition: "turn",
            value: "your",
          },
        ],
        actions: [
          {
            action: "grantKeyword",
            target: {
              player: "self",
              zones: ["leader"],
              count: {
                amount: 1,
              },
            },
            keyword: "doubleAttack",
            duration: "permanent",
          },
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["leader"],
              count: {
                amount: "all",
              },
            },
            value: 2000,
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: op16EdwardNewgate003I18n,
};
