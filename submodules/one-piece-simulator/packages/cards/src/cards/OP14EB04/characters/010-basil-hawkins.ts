import type { CharacterCard } from "@tcg/op-types";
import { op14eb04BasilHawkins010I18n } from "./010-basil-hawkins.i18n.ts";

export const op14eb04BasilHawkins010: CharacterCard = {
  id: "OP14-010",
  cardType: "character",
  color: ["red"],
  rarity: "UC",
  setId: "OP14EB04",
  cost: 1,
  power: 2000,
  counter: 1000,
  traits: ["Hawkins Pirates Supernovas"],
  attribute: "slash",
  effect:
    "[On K.O.] Look at 5 cards from the top of your deck; play up to 1 {Supernovas} type Character card with 2000 power or less other than [Basil Hawkins]. Then, place the rest at the bottom of your deck in any order.",
  effects: {
    effects: [
      {
        trigger: "onKo",
        actions: [
          {
            action: "search",
            lookCount: 5,
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
                filter: "excludeName",
                value: "Basil Hawkins",
              },
              {
                filter: "power",
                comparison: "lte",
                value: 2000,
              },
              {
                filter: "trait",
                value: "Supernovas",
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
  i18n: op14eb04BasilHawkins010I18n,
};
