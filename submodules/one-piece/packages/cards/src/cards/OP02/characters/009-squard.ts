import type { CharacterCard } from "@tcg/op-types";
import { op02Squard009I18n } from "./009-squard.i18n.ts";

export const op02Squard009: CharacterCard = {
  id: "OP02-009",
  canonicalId: "OP02-009",
  slug: "squard",
  name: "Squard",
  printings: [
    {
      id: "OP02-009",
      artId: "OP02-009",
      setCode: "OP02",
      collectorNumber: "009",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-009.jpg",
    },
    {
      id: "OP02-009_p1",
      artId: "OP02-009_p1",
      setCode: "OP02",
      collectorNumber: "009",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-009_p1.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "UC",
  setId: "OP02",
  cost: 3,
  power: 5000,
  traits: ["Whitebeard Pirates Allies"],
  attribute: "slash",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-009_p1.jpg",
      imageId: "OP02-009_p1",
    },
  ],
  effect:
    "[On Play] If your Leader's type includes \"Whitebeard Pirates\", give up to 1 of your opponent's Characters -4000 power during this turn and add 1 card from the top of your Life cards to your hand.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Whitebeard Pirates",
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
            value: -4000,
            duration: "thisTurn",
          },
          {
            action: "removeFromLife",
            player: "self",
            count: {
              amount: 1,
            },
            destination: "hand",
          },
        ],
      },
    ],
  },
  i18n: op02Squard009I18n,
};
