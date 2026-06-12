import type { CharacterCard } from "@tcg/op-types";
import { op10Vergo004I18n } from "./004-vergo.i18n.ts";

export const op10Vergo004: CharacterCard = {
  id: "OP10-004",
  cardType: "character",
  color: ["red"],
  rarity: "R",
  setId: "OP10",
  cost: 1,
  power: 2000,
  counter: 1000,
  traits: ["Donquixote Pirates Navy Punk Hazard"],
  attribute: "strike",
  effect:
    "[On Play] Look at 5 cards from the top of your deck; reveal up to 1 {Punk Hazard} type card other than [Vergo] and add it to your hand. Then, place the rest at the bottom of your deck in any order.",
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
                value: "Vergo",
              },
              {
                filter: "trait",
                value: "Punk Hazard",
              },
            ],
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
        ],
      },
    ],
  },
  i18n: op10Vergo004I18n,
};
