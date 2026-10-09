import type { CharacterCard } from "@tcg/op-types";
import { st33MonkeyDGarp005I18n } from "./st33-005-monkey-d-garp.i18n.ts";
export const st33MonkeyDGarp005: CharacterCard = {
  id: "ST33-005",
  canonicalId: "ST33-005",
  slug: "monkey-d-garp/st33-005",
  name: "Monkey.D.Garp",
  printings: [
    {
      id: "ST33-005",
      artId: "ST33-005",
      setCode: "ST33",
      collectorNumber: "005",
      rarity: "SR",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST33-005.png",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "SR",
  setId: "ST33",
  cost: 6,
  power: 6000,
  counter: 1000,
  traits: ["Navy"],
  attribute: "strike",
  effect:
    "[On Play] If your Leader has the {Navy} type, play up to 1 blue {Navy} type Character card with 8000 power or less other than [Monkey.D.Garp] from your hand.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Navy",
            match: "exact",
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
                filter: "excludeName",
                value: "Monkey.D.Garp",
              },
              {
                filter: "power",
                comparison: "lte",
                value: 8000,
              },
              {
                filter: "color",
                value: "blue",
              },
              {
                filter: "trait",
                value: "Navy",
                match: "exact",
              },
              {
                filter: "cardCategory",
                value: "character",
              },
            ],
          },
        ],
      },
    ],
  },
  i18n: st33MonkeyDGarp005I18n,
};
