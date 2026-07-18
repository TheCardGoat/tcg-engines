import type { CharacterCard } from "@tcg/op-types";
import { op06VinsmokeJudge062I18n } from "./062-vinsmoke-judge.i18n.ts";

export const op06VinsmokeJudge062: CharacterCard = {
  id: "OP06-062",
  canonicalId: "OP06-062",
  slug: "vinsmoke-judge/op06-062",
  name: "Vinsmoke Judge",
  printings: [
    {
      id: "OP06-062",
      artId: "OP06-062",
      setCode: "OP06",
      collectorNumber: "062",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-062.jpg",
    },
    {
      id: "OP06-062_p1",
      artId: "OP06-062_p1",
      setCode: "OP06",
      collectorNumber: "062",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-062_p1.jpg",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "SR",
  setId: "OP06",
  cost: 8,
  power: 8000,
  traits: ["The Vinsmoke Family GERMA 66"],
  attribute: "slash",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-062_p1.jpg",
      imageId: "OP06-062_p1",
    },
  ],
  effect:
    '[On Play] DON!! -1 (You may return the specified number of DON!! cards from your field to your DON!! deck.) You may trash 2 cards from your hand: Play up to 4 "GERMA 66" type Character cards with different card names and 4000 power or less from your trash.\n[Activate:Main] [Once Per Turn] DON!! -1: Rest up to 1 of your opponent\'s DON!! cards.',
  effects: {
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "returnDon",
            amount: 1,
          },
          {
            cost: "trashFromHand",
            amount: 2,
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
              amount: 4,
              upTo: true,
            },
            differentNames: true,
            filters: [
              {
                filter: "power",
                comparison: "lte",
                value: 4000,
              },
              {
                filter: "trait",
                value: "GERMA 66",
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
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "returnDon",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "rest",
            target: {
              player: "opponent",
              zones: ["costArea"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: op06VinsmokeJudge062I18n,
};
