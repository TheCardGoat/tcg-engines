import type { CharacterCard } from "@tcg/op-types";
import { op14eb04Aladine043I18n } from "./043-aladine.i18n.ts";

export const op14eb04Aladine043: CharacterCard = {
  id: "OP14-043",
  cardType: "character",
  color: ["blue"],
  rarity: "R",
  setId: "OP14EB04",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["The Sun Pirates Merfolk"],
  attribute: "slash",
  effect:
    "[On Play] Play up to 1 {Fish-Man} or {Merfolk} type Character card with a cost of 3 or less from your hand.\n[On K.O.] Draw 1 card.",
  effects: {
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
      {
        trigger: "onKo",
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
        ],
      },
    ],
  },
  i18n: op14eb04Aladine043I18n,
};
