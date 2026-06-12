import type { CharacterCard } from "@tcg/op-types";
import { prb02CharlottePuddingPrb02010010I18n } from "./010-charlotte-pudding-prb02-010.i18n.ts";

export const prb02CharlottePuddingPrb02010010: CharacterCard = {
  id: "PRB02-010",
  cardType: "character",
  color: ["purple"],
  rarity: "SR",
  setId: "PRB02",
  cost: 7,
  power: 5000,
  counter: 1000,
  traits: ["Big Mom Pirates"],
  attribute: "wisdom",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/PRB02-010_p1.jpg",
      imageId: "PRB02-010_p1",
    },
  ],
  effect:
    '[On Play] DON!! -2: If your Leader has the "Big Mom Pirates" type and your opponent has 6 or more DON!! cards on their field, draw 2 cards. Then, play up to 1 "Big Mom Pirates" type Character card with 6000 to 8000 power from your hand.',
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "compound",
            operator: "and",
            conditions: [
              {
                condition: "leaderTrait",
                trait: "Big Mom Pirates",
              },
              {
                condition: "donFieldCount",
                player: "opponent",
                comparison: "gte",
                value: 6,
              },
            ],
          },
        ],
        costs: [
          {
            cost: "returnDon",
            amount: 2,
          },
        ],
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 2,
          },
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
                value: "Big Mom Pirates",
              },
            ],
          },
        ],
      },
    ],
  },
  i18n: prb02CharlottePuddingPrb02010010I18n,
};
