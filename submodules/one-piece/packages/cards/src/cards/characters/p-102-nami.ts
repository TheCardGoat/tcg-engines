import type { CharacterCard } from "@tcg/op-types";
import { pNami102I18n } from "./p-102-nami.i18n.ts";
export const pNami102: CharacterCard = {
  id: "P-102",
  canonicalId: "P-102",
  slug: "nami/p-102",
  name: "Nami",
  printings: [
    {
      id: "P-102",
      artId: "P-102",
      setCode: "P",
      collectorNumber: "102",
      rarity: "P",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/P-102.png",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "P",
  setId: "P",
  cost: 4,
  power: 4000,
  counter: 2000,
  traits: ["Egghead", "Straw Hat Crew"],
  attribute: "special",
  effect:
    "[On Play] If your Leader has the {Straw Hat Crew} type, set up to 2 of your DON!! cards as active.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Straw Hat Crew",
            match: "exact",
          },
        ],
        actions: [
          {
            action: "setActive",
            target: {
              player: "self",
              zones: ["costArea"],
              count: {
                amount: 2,
                upTo: true,
              },
            },
          },
        ],
      },
    ],
  },
  i18n: pNami102I18n,
};
