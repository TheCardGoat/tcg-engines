import type { CharacterCard } from "@tcg/op-types";
import { op15Nami108I18n } from "./op15-108-nami.i18n.ts";

export const op15Nami108: CharacterCard = {
  id: "OP15-108",
  canonicalId: "OP15-108",
  slug: "nami/op15-108",
  name: "Nami",
  printings: [
    {
      id: "OP15-108",
      artId: "OP15-108",
      setCode: "OP15",
      collectorNumber: "108",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP15-108_Sdem4qd.jpg",
      label: "Nami (OP15-108)",
    },
    {
      id: "OP15-108_p1",
      artId: "OP15-108",
      setCode: "OP15",
      collectorNumber: "108",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP15-108_3uuMAJI.jpg",
      label: "Nami (OP15-108) (Dash Pack)",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "R",
  setId: "OP15",
  cost: 1,
  power: 2000,
  counter: 2000,
  traits: ["Straw Hat Crew Sky Island"],
  attribute: "special",
  effect:
    "[On Play] Look at 3 cards from the top of your deck; reveal up to 1 {Sky Island} type card and add it to your hand. Then, place the rest at the bottom of your deck in any order.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
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
                value: "Sky Island",
                match: "includes",
              },
            ],
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
        ],
      },
    ],
  },
  i18n: op15Nami108I18n,
};
