import type { CharacterCard } from "@tcg/op-types";
import { op13Shanks065I18n } from "./065-shanks.i18n.ts";

export const op13Shanks065: CharacterCard = {
  id: "OP13-065",
  cardType: "character",
  color: ["purple"],
  rarity: "R",
  setId: "OP13",
  cost: 1,
  power: 2000,
  counter: 1000,
  traits: ["Roger Pirates"],
  attribute: "slash",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP13-065_p1_2rAgYMu.jpg",
      imageId: "OP13-065_p1",
    },
  ],
  effect:
    '[On Play] Look at 5 cards from the top of your deck; reveal up to 1 card with a type including "Roger Pirates" other than [Shanks] and add it to your hand. Then, place the rest at the bottom of your deck in any order.',
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
                value: "Shanks",
              },
            ],
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
        ],
      },
    ],
  },
  i18n: op13Shanks065I18n,
};
