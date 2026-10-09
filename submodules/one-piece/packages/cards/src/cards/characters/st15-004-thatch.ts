import type { CharacterCard } from "@tcg/op-types";
import { st15Thatch004I18n } from "./st15-004-thatch.i18n.ts";
export const st15Thatch004: CharacterCard = {
  id: "ST15-004",
  canonicalId: "ST15-004",
  slug: "thatch/st15-004",
  name: "Thatch",
  printings: [
    {
      id: "ST15-004",
      artId: "ST15-004",
      setCode: "ST15",
      collectorNumber: "004",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST15-004.png",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "ST15",
  cost: 1,
  traits: ["Whitebeard Pirates"],
  power: 2000,
  attribute: "slash",
  counter: 2000,
  effect:
    "[On Play] If your Leader's type includes \"Whitebeard Pirates\", give up to 1 of your opponent's Characters −2000 power during this turn. Then, add 1 card from the top of your Life cards to your hand.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Whitebeard Pirates",
            match: "includes",
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
            value: -2000,
            duration: "thisTurn",
          },
          {
            action: "removeFromLife",
            player: "self",
            count: {
              amount: 1,
            },
            destination: "hand",
            position: "top",
          },
        ],
      },
    ],
  },
  i18n: st15Thatch004I18n,
};
