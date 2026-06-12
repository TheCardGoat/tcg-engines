import type { CharacterCard } from "@tcg/op-types";
import { op07Sengoku046I18n } from "./046-sengoku.i18n.ts";

export const op07Sengoku046: CharacterCard = {
  id: "OP07-046",
  cardType: "character",
  color: ["blue"],
  rarity: "R",
  setId: "OP07",
  cost: 1,
  power: 2000,
  counter: 1000,
  traits: ["Navy"],
  attribute: "wisdom",
  artVariants: [
    {
      type: "parallel",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP07-046_p1.jpg",
      imageId: "OP07-046_p1",
    },
  ],
  effect:
    "[On Play] Look at 5 cards from the top of your deck; reveal up to 1 [The Seven Warlords of the Sea] type card and add it to your hand. Then, place the rest at the bottom of your deck in any order.",
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
                value: "The Seven Warlords of the Sea",
              },
            ],
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
        ],
      },
    ],
  },
  i18n: op07Sengoku046I18n,
};
