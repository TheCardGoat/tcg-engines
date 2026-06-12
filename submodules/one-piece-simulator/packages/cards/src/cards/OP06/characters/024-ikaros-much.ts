import type { CharacterCard } from "@tcg/op-types";
import { op06IkarosMuch024I18n } from "./024-ikaros-much.i18n.ts";

export const op06IkarosMuch024: CharacterCard = {
  id: "OP06-024",
  cardType: "character",
  color: ["green"],
  rarity: "UC",
  setId: "OP06",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["Fish-Man New Fish-Man Pirates"],
  attribute: "slash",
  effect:
    "[On Play] If your Leader has the [New FIsh-Man Pirates] type, play up to 1 [Fish-Man] type Character card with a cost of 4 or less from your hand. Then, add 1 card from the top of your Life cards to your hand.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "New FIsh-Man Pirates",
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
                value: 4,
              },
              {
                filter: "trait",
                value: "Fish-Man",
              },
              {
                filter: "cardCategory",
                value: "character",
              },
            ],
          },
          {
            action: "removeFromLife",
            player: "self",
            count: {
              amount: 1,
            },
            destination: "hand",
          },
        ],
      },
    ],
  },
  i18n: op06IkarosMuch024I18n,
};
