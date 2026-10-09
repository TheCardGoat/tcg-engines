import type { CharacterCard } from "@tcg/op-types";
import { pMonkeyDLuffy159I18n } from "./p-159-monkey-d-luffy.i18n.ts";
export const pMonkeyDLuffy159: CharacterCard = {
  id: "P-159",
  canonicalId: "P-159",
  slug: "monkey-d-luffy/p-159",
  name: "Monkey.D.Luffy",
  printings: [
    {
      id: "P-159",
      artId: "P-159",
      setCode: "P",
      collectorNumber: "159",
      rarity: "P",
      imageUrl: "https://asia-en.onepiece-cardgame.com/images/cardlist/card/P-159.png",
    },
    {
      id: "P-159_p1",
      artId: "P-159_p1",
      setCode: "P",
      collectorNumber: "159",
      rarity: "P",
      imageUrl: "https://asia-en.onepiece-cardgame.com/images/cardlist/card/P-159_p1.png",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "P",
  setId: "P",
  cost: 1,
  traits: ["Elbaph", "The Four Emperors", "Straw Hat Crew"],
  power: 5000,
  attribute: "strike",
  counter: 2000,
  effect:
    "【On K.O.】If you have any DON!! cards given to your Leader, play up to 1 {Straw Hat Crew} type Character with 6000 power or less from your hand.",
  effects: {
    effects: [
      {
        trigger: "onKo",
        conditions: [
          {
            condition: "hasCard",
            player: "self",
            zone: "leader",
            filters: [
              {
                filter: "attachedDon",
                value: 1,
                comparison: "gte",
              },
            ],
          },
        ],
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
                filter: "trait",
                value: "Straw Hat Crew",
                match: "exact",
              },
              {
                filter: "power",
                value: 6000,
                comparison: "lte",
              },
            ],
          },
        ],
      },
    ],
  },
  i18n: pMonkeyDLuffy159I18n,
};
