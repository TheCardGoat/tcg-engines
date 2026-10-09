import type { CharacterCard } from "@tcg/op-types";
import { pLilith118I18n } from "./p-118-lilith.i18n.ts";
export const pLilith118: CharacterCard = {
  id: "P-118",
  canonicalId: "P-118",
  slug: "lilith/p-118",
  name: "Lilith",
  printings: [
    {
      id: "P-118",
      artId: "P-118",
      setCode: "P",
      collectorNumber: "118",
      rarity: "P",
      imageUrl: "https://asia-en.onepiece-cardgame.com/images/cardlist/card/P-118.png",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "P",
  setId: "P",
  cost: 6,
  power: 6000,
  counter: 1000,
  attribute: "wisdom",
  traits: ["Egghead", "Scientist"],
  effect:
    "[On Play] If your Leader has the {Egghead} type, play up to 1 {Egghead} type Character card or Character card with a [Trigger], with a cost of 5 or less from your hand.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "play",
            source: {
              player: "self",
              zone: "hand",
            },
            count: {
              amount: 1,
              upTo: true,
            },
            filters: [
              {
                filter: "cardCategory",
                value: "character",
              },
              {
                filter: "cost",
                comparison: "lte",
                value: 5,
              },
              {
                filter: "anyOf",
                filters: [
                  {
                    filter: "trait",
                    value: "Egghead",
                    match: "exact",
                  },
                  {
                    filter: "hasTrigger",
                    value: true,
                  },
                ],
              },
            ],
          },
        ],
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Egghead",
            match: "exact",
          },
        ],
      },
    ],
  },
  i18n: pLilith118I18n,
};
