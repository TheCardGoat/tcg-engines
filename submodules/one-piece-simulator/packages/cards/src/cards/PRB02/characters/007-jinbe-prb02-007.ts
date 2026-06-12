import type { CharacterCard } from "@tcg/op-types";
import { prb02JinbePrb02007007I18n } from "./007-jinbe-prb02-007.i18n.ts";

export const prb02JinbePrb02007007: CharacterCard = {
  id: "PRB02-007",
  cardType: "character",
  color: ["blue"],
  rarity: "R",
  setId: "PRB02",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Fish-Man The Seven Warlords of the Sea The Sun Pirates"],
  attribute: "strike",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/PRB02-007_p1.jpg",
      imageId: "PRB02-007_p1",
    },
  ],
  effect:
    '[On Play] Look at 5 cards from the top of your deck; reveal up to 1 "The Seven Warlords of the Sea" type card other than [Jinbe] and add it to your hand. Then, place the rest at the bottom of your deck in any order.',
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
                value: "Jinbe",
              },
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
  i18n: prb02JinbePrb02007007I18n,
};
