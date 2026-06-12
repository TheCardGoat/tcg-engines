import type { CharacterCard } from "@tcg/op-types";
import { op06EmporioIvankov003I18n } from "./003-emporio-ivankov.i18n.ts";

export const op06EmporioIvankov003: CharacterCard = {
  id: "OP06-003",
  cardType: "character",
  color: ["red"],
  rarity: "UC",
  setId: "OP06",
  cost: 5,
  power: 6000,
  traits: ["Revolutionary Army"],
  attribute: "special",
  effect:
    "[On Play] Look at 3 cards from the top of your deck and play up to 1 [Revolutionary Army] type Character card with 5000 power or less. Then, place the rest at the bottom of your deck in any order.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "search",
            lookCount: 3,
            source: {
              player: "self",
              zone: "deck",
            },
            revealCount: {
              amount: 1,
              upTo: true,
            },
            revealFilters: [
              {
                filter: "power",
                comparison: "lte",
                value: 5000,
              },
              {
                filter: "trait",
                value: "Revolutionary Army",
              },
              {
                filter: "cardCategory",
                value: "character",
              },
            ],
            revealDestination: "character",
            remainderPosition: "bottom",
          },
        ],
      },
    ],
  },
  i18n: op06EmporioIvankov003I18n,
};
