import type { CharacterCard } from "@tcg/op-types";
import { op12DonquixoteRosinante108I18n } from "./108-donquixote-rosinante.i18n.ts";

export const op12DonquixoteRosinante108: CharacterCard = {
  id: "OP12-108",
  cardType: "character",
  color: ["yellow"],
  rarity: "R",
  setId: "OP12",
  cost: 1,
  power: 2000,
  counter: 1000,
  traits: ["Donquixote Pirates Navy"],
  attribute: "special",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP12-108_p1_VghtZgi.jpg",
      imageId: "OP12-108_p1",
    },
  ],
  effect:
    "[On Play] Look at 5 cards from the top of your deck; reveal up to 1 [Trafalgar Law] and add it to your hand. Then, place the rest at the bottom of your deck in any order.",
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
                filter: "name",
                value: "Trafalgar Law",
              },
            ],
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
        ],
      },
    ],
  },
  i18n: op12DonquixoteRosinante108I18n,
};
