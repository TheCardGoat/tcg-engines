import type { CharacterCard } from "@tcg/op-types";
import { op09Uta002I18n } from "./002-uta.i18n.ts";

export const op09Uta002: CharacterCard = {
  id: "OP09-002",
  cardType: "character",
  color: ["red"],
  rarity: "R",
  setId: "OP09",
  cost: 1,
  power: 2000,
  counter: 1000,
  traits: ["FILM"],
  attribute: "special",
  artVariants: [
    {
      type: "parallel",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-002_p1.jpg",
      imageId: "OP09-002_p1",
    },
  ],
  effect:
    '[On Play] Look at 5 cards from the top of your deck; reveal up to 1 "Red-Haired Pirates" type card and add it to your hand. Then, place the rest at the bottom of your deck in any order.',
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
                filter: "trait",
                value: "Red-Haired Pirates",
              },
            ],
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
        ],
      },
    ],
  },
  i18n: op09Uta002I18n,
};
