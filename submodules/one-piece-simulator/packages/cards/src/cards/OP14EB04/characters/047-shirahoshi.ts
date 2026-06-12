import type { CharacterCard } from "@tcg/op-types";
import { op14eb04Shirahoshi047I18n } from "./047-shirahoshi.i18n.ts";

export const op14eb04Shirahoshi047: CharacterCard = {
  id: "OP14-047",
  cardType: "character",
  color: ["blue"],
  rarity: "R",
  setId: "OP14EB04",
  cost: 4,
  power: 0,
  counter: 1000,
  traits: ["Merfolk Fish-Man Island"],
  attribute: "wisdom",
  effect:
    "[Blocker]\n[On Play] Draw 1 card and play up to 1 {Fish-Man} or {Merfolk} type Character card with a cost of 3 or less from your hand.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
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
                filter: "cost",
                comparison: "lte",
                value: 3,
              },
              {
                filter: "trait",
                value: "Fish-Man",
              },
              {
                filter: "trait",
                value: "Merfolk",
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
  i18n: op14eb04Shirahoshi047I18n,
};
