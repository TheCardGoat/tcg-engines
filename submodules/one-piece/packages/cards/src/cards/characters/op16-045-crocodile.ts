import type { CharacterCard } from "@tcg/op-types";
import { op16Crocodile045I18n } from "./op16-045-crocodile.i18n.ts";

export const op16Crocodile045: CharacterCard = {
  id: "OP16-045",
  canonicalId: "OP16-045",
  slug: "crocodile/op16-045",
  name: "Crocodile",
  printings: [
    {
      id: "OP16-045",
      artId: "OP16-045",
      setCode: "OP16",
      collectorNumber: "045",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP16-045_mbh6UBz.jpg",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "UC",
  setId: "OP16",
  cost: 4,
  power: 6000,
  traits: ["Impel Down Former Baroque Works"],
  attribute: "special",
  effect:
    "[Blocker]\n\n[On Play] You may return 1 of your Characters with a cost of 2 or more to the owner's hand: Play up to 1 {Impel Down} type Character card with a cost of 2 or less from your hand.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "returnCharacter",
            amount: 1,
            filters: [
              {
                filter: "cost",
                comparison: "gte",
                value: 2,
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
                filter: "cost",
                comparison: "lte",
                value: 2,
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
  i18n: op16Crocodile045I18n,
};
