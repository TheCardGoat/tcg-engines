import type { CharacterCard } from "@tcg/op-types";
import { pBuggy084I18n } from "./p-084-buggy.i18n.ts";

export const pBuggy084: CharacterCard = {
  id: "P-084",
  canonicalId: "P-084",
  slug: "buggy/p-084",
  name: "Buggy",
  printings: [
    {
      id: "P-084",
      artId: "P-084_p1",
      setCode: "P",
      collectorNumber: "084",
      rarity: "P",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/P-084_p1.jpg",
      label: "Buggy (P-084) (SP)",
    },
  ],
  cardType: "character",
  attribute: "strike",
  color: ["blue"],
  rarity: "P",
  setId: "P",
  cost: 7,
  power: 8000,
  effects: {
    permanentEffects: [
      {
        actions: [
          {
            action: "cannotAttack",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            duration: "permanent",
          },
        ],
      },
      {
        conditions: [
          {
            condition: "leaderName",
            name: "Buggy",
          },
        ],
        actions: [
          {
            action: "cannotAttack",
            target: {
              player: "both",
              zones: ["character"],
              count: {
                amount: "all",
              },
              filters: [
                {
                  filter: "anyOf",
                  groups: [
                    [{ filter: "cost", comparison: "eq", value: 3 }],
                    [{ filter: "cost", comparison: "eq", value: 4 }],
                  ],
                },
              ],
            },
            duration: "permanent",
          },
        ],
      },
    ],
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
                filter: "trait",
                value: "Cross Guild",
                match: "includes",
              },
              {
                filter: "cost",
                comparison: "lte",
                value: 6,
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
  i18n: pBuggy084I18n,
};
