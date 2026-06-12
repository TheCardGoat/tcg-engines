import type { CharacterCard } from "@tcg/op-types";
import { op06MonkeyDLuffy013I18n } from "./013-monkey-d-luffy.i18n.ts";

export const op06MonkeyDLuffy013: CharacterCard = {
  id: "OP06-013",
  cardType: "character",
  color: ["red"],
  rarity: "R",
  setId: "OP06",
  cost: 3,
  power: 3000,
  counter: 1000,
  trigger: "Activate this card's [On Play] effect.",
  traits: ["FILM Straw Hat Crew"],
  attribute: "strike",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-013_p1.jpg",
      imageId: "OP06-013_p1",
    },
  ],
  effect:
    '[On Play] Look at 3 cards from the top of your deck; reveal up to 1 "FILM" type card and add it to your hand. Then, place the rest at the bottom of your deck in any order.',
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
                filter: "trait",
                value: "FILM",
              },
            ],
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
        ],
      },
    ],
  },
  i18n: op06MonkeyDLuffy013I18n,
};
