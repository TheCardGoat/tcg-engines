import type { CharacterCard } from "@tcg/op-types";
import { op17Limejuice032I18n } from "./op17-032-limejuice.i18n.ts";

export const op17Limejuice032: CharacterCard = {
  id: "OP17-032",
  canonicalId: "OP17-032",
  slug: "limejuice/op17-032",
  name: "Limejuice",
  printings: [
    {
      id: "OP17-032",
      artId: "OP17-032",
      setCode: "OP17",
      collectorNumber: "032",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP17-032_5vkDoe8.jpg",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "R",
  setId: "OP17",
  cost: 1,
  power: 2000,
  counter: 2000,
  traits: ["Red-Haired Pirates"],
  attribute: "special",
  effect:
    '[On Play] Look at 3 cards from the top of your deck; reveal up to 1 card with a type including "Red-Haired Pirates" and add it to your hand. Then, place the rest at the bottom of your deck in any order.',
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
                value: "Red-Haired Pirates",
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
  i18n: op17Limejuice032I18n,
};
