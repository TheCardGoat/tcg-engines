import type { CharacterCard } from "@tcg/op-types";
import { op06Camie025I18n } from "./025-camie.i18n.ts";

export const op06Camie025: CharacterCard = {
  id: "OP06-025",
  cardType: "character",
  color: ["green"],
  rarity: "R",
  setId: "OP06",
  cost: 1,
  power: 2000,
  counter: 1000,
  traits: ["Merfolk"],
  attribute: "wisdom",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-025_p1.jpg",
      imageId: "OP06-025_p1",
    },
  ],
  effect:
    '[On Play] Look at 4 cards from the top of your deck; reveal up to 1 "Fish-Man" or "Merfolk" type card other than [Camie] and add it to your hand. Then, place the rest at the bottom of your deck in any order.',
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "search",
            lookCount: 4,
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
                value: "Camie",
              },
              {
                filter: "trait",
                value: "Fish-Man",
              },
              {
                filter: "trait",
                value: "Merfolk",
              },
            ],
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
        ],
      },
    ],
  },
  i18n: op06Camie025I18n,
};
