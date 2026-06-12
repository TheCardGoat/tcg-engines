import type { CharacterCard } from "@tcg/op-types";
import { op13StJaygarciaSaturn083I18n } from "./083-st-jaygarcia-saturn.i18n.ts";

export const op13StJaygarciaSaturn083: CharacterCard = {
  id: "OP13-083",
  cardType: "character",
  color: ["black"],
  rarity: "R",
  setId: "OP13",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Celestial Dragons Five Elders"],
  attribute: "special",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP13-083_p1_DyviEiB.jpg",
      imageId: "OP13-083_p1",
    },
    {
      type: "parallel",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP13-083_p2.jpg",
      imageId: "OP13-083_p2",
    },
  ],
  effect:
    'If you have 7 or more cards in your trash, this Character cannot be removed from the field by your opponent\'s effects.\n[On Play] Look at 5 cards from the top of your deck; reveal up to 1 "Five Elders" type card and add it to your hand. Then, place the rest at the bottom of your deck in any order.',
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
                value: "Five Elders",
              },
            ],
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
        ],
      },
    ],
  },
  i18n: op13StJaygarciaSaturn083I18n,
};
