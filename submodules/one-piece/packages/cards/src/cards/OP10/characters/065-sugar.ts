import type { CharacterCard } from "@tcg/op-types";
import { op10Sugar065I18n } from "./065-sugar.i18n.ts";

export const op10Sugar065: CharacterCard = {
  id: "OP10-065",
  canonicalId: "OP10-065",
  slug: "sugar/op10-065",
  name: "Sugar",
  printings: [
    {
      id: "OP10-065",
      artId: "OP10-065",
      setCode: "OP10",
      collectorNumber: "065",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP10-065.jpg",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "R",
  setId: "OP10",
  cost: 1,
  power: 1000,
  counter: 1000,
  traits: ["Donquixote Pirates"],
  attribute: "special",
  effect:
    '[Activate: Main] You may rest 1 of your DON!! cards and this Character: Look at 5 cards from the top of your deck; reveal up to 1 "Donquixote Pirates" type card and add it to your hand. Then, place the rest at the bottom of your deck in any order.',
  effects: {
    effects: [
      {
        trigger: "activateMain",
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
                value: "Donquixote Pirates",
              },
            ],
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op10Sugar065I18n,
};
