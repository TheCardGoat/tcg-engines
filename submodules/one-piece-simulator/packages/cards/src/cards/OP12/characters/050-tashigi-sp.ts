import type { CharacterCard } from "@tcg/op-types";
import { op12TashigiSp050I18n } from "./050-tashigi-sp.i18n.ts";

export const op12TashigiSp050: CharacterCard = {
  id: "OP06-050",
  cardType: "character",
  color: ["blue"],
  rarity: "R",
  setId: "OP12",
  cost: 1,
  power: 2000,
  counter: 1000,
  traits: ["Navy"],
  attribute: "slash",
  effect:
    '[On Play] Look at 5 cards from the top of your deck; reveal up to 1 "Navy" type card other than [Tashigi] and add it to your hand. Then, place the rest at the bottom of your deck in any order.',
  effects: {
    effects: [
      {
        trigger: "onPlay",
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
                value: "Tashigi",
              },
              {
                filter: "trait",
                value: "Navy",
              },
            ],
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
        ],
      },
    ],
  },
  i18n: op12TashigiSp050I18n,
};
