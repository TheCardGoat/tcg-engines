import type { CharacterCard } from "@tcg/op-types";
import { op08Wyper110I18n } from "./110-wyper.i18n.ts";

export const op08Wyper110: CharacterCard = {
  id: "OP08-110",
  cardType: "character",
  color: ["yellow"],
  rarity: "R",
  setId: "OP08",
  cost: 4,
  power: 5000,
  counter: 2000,
  traits: ["Sky Island Shandian Warrior"],
  attribute: "ranged",
  artVariants: [
    {
      type: "parallel",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP08-110_p1.jpg",
      imageId: "OP08-110_p1",
    },
  ],
  effect:
    "[On Play] Look at 5 cards from the top of your deck; reveal up to 1 [Upper Yard] and add it to your hand. Then, place the rest at the bottom of your deck in any order and play up to 1 [Upper Yard] from your hand.",
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
                value: "Upper Yard",
              },
            ],
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
          {
            action: "play",
            source: {
              player: "self",
              zone: "hand",
            },
            count: {
              amount: 1,
              upTo: true,
            },
            filters: [
              {
                filter: "name",
                value: "Upper Yard",
              },
            ],
          },
        ],
      },
    ],
  },
  i18n: op08Wyper110I18n,
};
