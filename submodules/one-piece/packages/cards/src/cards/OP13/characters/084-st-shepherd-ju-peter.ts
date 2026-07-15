import type { CharacterCard } from "@tcg/op-types";
import { op13StShepherdJuPeter084I18n } from "./084-st-shepherd-ju-peter.i18n.ts";

export const op13StShepherdJuPeter084: CharacterCard = {
  id: "OP13-084",
  canonicalId: "OP13-084",
  slug: "st-shepherd-ju-peter",
  name: "St. Shepherd Ju Peter",
  printings: [
    {
      id: "OP13-084",
      artId: "OP13-084",
      setCode: "OP13",
      collectorNumber: "084",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP13-084_sHvqdwa.jpg",
    },
    {
      id: "OP13-084_p1",
      artId: "OP13-084_p1",
      setCode: "OP13",
      collectorNumber: "084",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP13-084_p1_oqpeaa5.jpg",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "R",
  setId: "OP13",
  cost: 7,
  power: 5000,
  counter: 2000,
  traits: ["Celestial Dragons Five Elders"],
  attribute: "special",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP13-084_p1_oqpeaa5.jpg",
      imageId: "OP13-084_p1",
    },
    {
      type: "parallel",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP13-084_4G64N0X.jpg",
      imageId: "OP13-084",
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
  i18n: op13StShepherdJuPeter084I18n,
};
