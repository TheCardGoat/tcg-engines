import type { CharacterCard } from "@tcg/op-types";
import { op09Perona034I18n } from "./034-perona.i18n.ts";

export const op09Perona034: CharacterCard = {
  id: "OP09-034",
  cardType: "character",
  color: ["green"],
  rarity: "R",
  setId: "OP09",
  cost: 1,
  power: 2000,
  counter: 2000,
  traits: ["Thriller Bark Pirates Muggy Kingdom"],
  attribute: "special",
  artVariants: [
    {
      type: "parallel",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-034_p1.jpg",
      imageId: "OP09-034_p1",
    },
  ],
  effect:
    '[On Play] Look at 5 cards from the top of your deck; reveal up to 1 [Dracule Mihawk] or "Thriller Bark Pirates" type card and add it to your hand. Then, place the rest at the bottom of your deck in any order and trash 1 card from your hand.',
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
                value: "Dracule Mihawk",
              },
              {
                filter: "trait",
                value: "Thriller Bark Pirates",
              },
            ],
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
          {
            action: "trashFromHand",
            player: "self",
            amount: 1,
          },
        ],
      },
    ],
  },
  i18n: op09Perona034I18n,
};
