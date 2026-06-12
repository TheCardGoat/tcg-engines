import type { CharacterCard } from "@tcg/op-types";
import { op10MonkeyDLuffy111I18n } from "./111-monkey-d-luffy.i18n.ts";

export const op10MonkeyDLuffy111: CharacterCard = {
  id: "OP10-111",
  cardType: "character",
  color: ["yellow"],
  rarity: "R",
  setId: "OP10",
  cost: 1,
  power: 2000,
  counter: 1000,
  traits: ["Straw Hat Crew Supernovas"],
  attribute: "strike",
  artVariants: [
    {
      type: "parallel",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP10-111_p1.jpg",
      imageId: "OP10-111_p1",
    },
  ],
  effect:
    '[On Play] Look at 5 cards from the top of your deck; reveal up to 1 "Supernovas" type card other than [Monkey.D.Luffy] and add it to your hand. Then, place the rest at the bottom of your deck in any order.',
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
                value: "Monkey.D.Luffy",
              },
              {
                filter: "trait",
                value: "Supernovas",
              },
            ],
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
        ],
      },
    ],
  },
  i18n: op10MonkeyDLuffy111I18n,
};
