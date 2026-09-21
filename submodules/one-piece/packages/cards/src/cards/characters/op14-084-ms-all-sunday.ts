import type { CharacterCard } from "@tcg/op-types";
import { op14eb04MsAllSunday084I18n } from "./op14-084-ms-all-sunday.i18n.ts";

export const op14eb04MsAllSunday084: CharacterCard = {
  id: "OP14-084",
  canonicalId: "OP14-084",
  slug: "ms-all-sunday/op14-084",
  name: "Ms. All Sunday",
  printings: [
    {
      id: "OP14-084",
      artId: "OP14-084",
      setCode: "OP14",
      collectorNumber: "084",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP14-084_59GqPHf.jpg",
    },
    {
      id: "OP14-084_p1",
      artId: "OP14-084_p1",
      setCode: "OP14",
      collectorNumber: "084",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP14-084_p1_RTfuoka.jpg",
      label: "Ms. All Sunday (Alternate Art)",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "SR",
  setId: "OP14",
  cost: 7,
  power: 8000,
  traits: ["Baroque Works"],
  attribute: "strike",
  effect:
    '[On Play] If your Leader\'s type includes "Baroque Works", play up to 1 Character card with a type including "Baroque Works" and a cost of 4 or less and up to 1 Character card with a type including "Baroque Works" and a cost of 1 from your trash.',
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Baroque Works",
            match: "includes",
          },
        ],
        actions: [
          {
            action: "play",
            source: {
              player: "self",
              zone: "trash",
            },
            count: {
              amount: 1,
              upTo: true,
            },
            filters: [
              {
                filter: "cost",
                comparison: "lte",
                value: 4,
              },
              {
                filter: "trait",
                value: "Baroque Works",
                match: "includes",
              },
              {
                filter: "cardCategory",
                value: "character",
              },
            ],
          },
          {
            action: "play",
            source: {
              player: "self",
              zone: "trash",
            },
            count: {
              amount: 1,
              upTo: true,
            },
            filters: [
              {
                filter: "cost",
                comparison: "eq",
                value: 1,
              },
              {
                filter: "trait",
                value: "Baroque Works",
                match: "includes",
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
  i18n: op14eb04MsAllSunday084I18n,
};
