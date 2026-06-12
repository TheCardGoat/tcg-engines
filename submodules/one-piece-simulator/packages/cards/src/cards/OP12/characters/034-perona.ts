import type { CharacterCard } from "@tcg/op-types";
import { op12Perona034I18n } from "./034-perona.i18n.ts";

export const op12Perona034: CharacterCard = {
  id: "OP12-034",
  cardType: "character",
  color: ["green"],
  rarity: "SR",
  setId: "OP12",
  cost: 1,
  power: 2000,
  counter: 1000,
  traits: ["Thriller Bark Pirates Muggy Kingdom"],
  attribute: "special",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP12-034_p1_2OgTMfI.jpg",
      imageId: "OP12-034_p1",
    },
  ],
  effect:
    "[On Play] If your Leader has the (Slash) attribute, look at 5 cards from the top of your deck; reveal up to 1 (Slash) attribute card or green Event and add it to your hand. Then, place the rest at the bottom of your deck in any order.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "slash",
          },
        ],
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
                filter: "attribute",
                value: "slash",
              },
            ],
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
        ],
      },
    ],
  },
  i18n: op12Perona034I18n,
};
