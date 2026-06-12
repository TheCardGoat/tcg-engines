import type { CharacterCard } from "@tcg/op-types";
import { op13Lilith113I18n } from "./113-lilith.i18n.ts";

export const op13Lilith113: CharacterCard = {
  id: "OP13-113",
  cardType: "character",
  color: ["yellow"],
  rarity: "R",
  setId: "OP13",
  cost: 1,
  power: 2000,
  counter: 1000,
  trigger: "Activate this card's [On Play] effect.",
  traits: ["Scientist Egghead"],
  attribute: "wisdom",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP13-113_p1_Tn6Q6cv.jpg",
      imageId: "OP13-113_p1",
    },
  ],
  effect:
    "[On Play] Look at 4 cards from the top of your deck; reveal up to 1 card with a [Trigger] other than [Lilith] and add it to your hand. Then, place the rest at the bottom of your deck in any order.",
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
                value: "Lilith",
              },
            ],
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
        ],
      },
    ],
  },
  i18n: op13Lilith113I18n,
};
