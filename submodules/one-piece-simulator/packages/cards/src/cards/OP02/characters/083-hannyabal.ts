import type { CharacterCard } from "@tcg/op-types";
import { op02Hannyabal083I18n } from "./083-hannyabal.i18n.ts";

export const op02Hannyabal083: CharacterCard = {
  id: "OP02-083",
  cardType: "character",
  color: ["purple"],
  rarity: "R",
  setId: "OP02",
  cost: 1,
  power: 2000,
  counter: 1000,
  traits: ["Impel Down"],
  attribute: "slash",
  effect:
    "[On Play] Look at 5 cards from the top of your deck; reveal up to 1 purple [Impel Down] type card other than [Hannyabal] and add it to your hand. Then, place the rest at the bottom of your deck in any order.",
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
                value: "Hannyabal",
              },
              {
                filter: "color",
                value: "purple",
              },
              {
                filter: "trait",
                value: "Impel Down",
              },
            ],
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
        ],
      },
    ],
  },
  i18n: op02Hannyabal083I18n,
};
