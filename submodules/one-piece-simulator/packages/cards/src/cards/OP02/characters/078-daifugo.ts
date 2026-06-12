import type { CharacterCard } from "@tcg/op-types";
import { op02Daifugo078I18n } from "./078-daifugo.i18n.ts";

export const op02Daifugo078: CharacterCard = {
  id: "OP02-078",
  cardType: "character",
  color: ["purple"],
  rarity: "UC",
  setId: "OP02",
  cost: 3,
  power: 5000,
  traits: ["Animal Kingdom Pirates SMILE"],
  attribute: "ranged",
  effect:
    "[On Play] DON!! -2 (You may return the specified number of DON!! cards from your field to your DON!! deck.): Play up to 1 [SMILE] type Character card other than [Daifugo] with a cost of 3 or less from your hand.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "returnDon",
            amount: 2,
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
                value: "Daifugo",
              },
              {
                filter: "cost",
                comparison: "lte",
                value: 3,
              },
              {
                filter: "trait",
                value: "SMILE",
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
  i18n: op02Daifugo078I18n,
};
