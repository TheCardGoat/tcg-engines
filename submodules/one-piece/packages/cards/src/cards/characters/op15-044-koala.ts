import type { CharacterCard } from "@tcg/op-types";
import { op15Koala044I18n } from "./op15-044-koala.i18n.ts";

export const op15Koala044: CharacterCard = {
  id: "OP15-044",
  canonicalId: "OP15-044",
  slug: "koala/op15-044",
  name: "Koala",
  printings: [
    {
      id: "OP15-044",
      artId: "OP15-044",
      setCode: "OP15",
      collectorNumber: "044",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP15-044_vrJat4E.jpg",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "OP15",
  cost: 3,
  power: 2000,
  counter: 1000,
  traits: ["Revolutionary Army Dressrosa"],
  attribute: "strike",
  effect:
    "[Blocker]\n[On K.O.] Look at 3 cards from the top of your deck; reveal up to 1 {Dressrosa} type Event and add it to your hand. Then, place the rest at the bottom of your deck in any order.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onKo",
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
                value: "Dressrosa",
                match: "includes",
              },
              {
                filter: "cardCategory",
                value: "event",
              },
            ],
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
        ],
      },
    ],
  },
  i18n: op15Koala044I18n,
};
