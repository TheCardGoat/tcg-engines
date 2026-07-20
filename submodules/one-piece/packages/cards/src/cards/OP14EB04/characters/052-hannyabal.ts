import type { CharacterCard } from "@tcg/op-types";
import { op14eb04Hannyabal052I18n } from "./052-hannyabal.i18n.ts";

export const op14eb04Hannyabal052: CharacterCard = {
  id: "OP14-052",
  canonicalId: "OP14-052",
  slug: "hannyabal/op14-052",
  name: "Hannyabal",
  printings: [
    {
      id: "OP14-052",
      artId: "OP14-052",
      setCode: "OP14EB04",
      collectorNumber: "052",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP14-052_97CTQjX.jpg",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "OP14EB04",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["Impel Down"],
  attribute: "slash",
  effect:
    "[Blocker]\n[On Play] You may trash 3 cards from your hand: Play up to 1 {Impel Down} type Character card with a cost of 6 or less from your hand.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "trashFromHand",
            amount: 3,
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
                filter: "cost",
                comparison: "lte",
                value: 6,
              },
              {
                filter: "trait",
                value: "Impel Down",
                match: "includes",
              },
              {
                filter: "cardCategory",
                value: "character",
              },
            ],
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op14eb04Hannyabal052I18n,
};
