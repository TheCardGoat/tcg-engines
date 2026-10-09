import type { CharacterCard } from "@tcg/op-types";
import { st34CharlotteCracker002I18n } from "./st34-002-charlotte-cracker.i18n.ts";
export const st34CharlotteCracker002: CharacterCard = {
  id: "ST34-002",
  canonicalId: "ST34-002",
  slug: "charlotte-cracker/st34-002",
  name: "Charlotte Cracker",
  printings: [
    {
      id: "ST34-002",
      artId: "ST34-002",
      setCode: "ST34",
      collectorNumber: "002",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST34-002.png",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "ST34",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Big Mom Pirates"],
  attribute: "slash",
  effect:
    "[On Play] If your Leader has the {Big Mom Pirates} type, add up to 1 DON!! card from your DON!! deck and rest it. Then, K.O. up to 1 of your opponent's Characters with a cost of 2 or less.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Big Mom Pirates",
            match: "exact",
          },
        ],
        actions: [
          {
            action: "addDon",
            count: {
              amount: 1,
              upTo: true,
            },
            state: "rested",
          },
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
                  filter: "cost",
                  comparison: "lte",
                  value: 2,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: st34CharlotteCracker002I18n,
};
