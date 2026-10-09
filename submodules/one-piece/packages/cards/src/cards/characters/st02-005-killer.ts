import type { CharacterCard } from "@tcg/op-types";
import { st02Killer005I18n } from "./st02-005-killer.i18n.ts";
export const st02Killer005: CharacterCard = {
  id: "ST02-005",
  canonicalId: "ST02-005",
  slug: "killer/st02-005",
  name: "Killer",
  printings: [
    {
      id: "ST02-005",
      artId: "ST02-005",
      setCode: "ST02",
      collectorNumber: "005",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST02-005.png",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "ST02",
  cost: 3,
  power: 3000,
  counter: 1000,
  traits: ["Supernovas", "Kid Pirates"],
  attribute: "slash",
  effect: "[On Play] K.O. up to 1 of your opponent's rested Characters with a cost of 3 or less.",
  trigger: "Play this card.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "ko",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "state",
                  value: "rested",
                },
                {
                  filter: "cost",
                  value: 3,
                  comparison: "lte",
                },
              ],
            },
          },
        ],
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "playThisCard",
          },
        ],
      },
    ],
  },
  i18n: st02Killer005I18n,
};
