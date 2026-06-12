import type { CharacterCard } from "@tcg/op-types";
import { op07Otama022I18n } from "./022-otama.i18n.ts";

export const op07Otama022: CharacterCard = {
  id: "OP07-022",
  cardType: "character",
  color: ["green"],
  rarity: "R",
  setId: "OP07",
  cost: 1,
  power: 0,
  counter: 2000,
  traits: ["Land of Wano"],
  attribute: "special",
  artVariants: [
    {
      type: "parallel",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP07-022_p1.jpg",
      imageId: "OP07-022_p1",
    },
  ],
  effect:
    "[On Play] Look at 5 cards from the top of your deck; reveal up to 1 green [Land of Wano] type card other than [Otama] and add it to your hand. Then, place the rest at the bottom of your deck in any order.",
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
                value: "Otama",
              },
              {
                filter: "color",
                value: "green",
              },
              {
                filter: "trait",
                value: "Land of Wano",
              },
            ],
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
        ],
      },
    ],
  },
  i18n: op07Otama022I18n,
};
