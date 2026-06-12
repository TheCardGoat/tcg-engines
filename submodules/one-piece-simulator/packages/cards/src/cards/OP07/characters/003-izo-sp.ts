import type { CharacterCard } from "@tcg/op-types";
import { op07IzoSp003I18n } from "./003-izo-sp.i18n.ts";

export const op07IzoSp003: CharacterCard = {
  id: "OP03-003",
  cardType: "character",
  color: ["red"],
  rarity: "R",
  setId: "OP07",
  cost: 1,
  power: 2000,
  counter: 1000,
  traits: ["Land of Wano Whitebeard Pirates"],
  attribute: "ranged",
  effect:
    '[On Play] Look at 5 cards from the top of your deck; reveal up to 1 card with a type including "Whitebeard Pirates" other than [Izo] and add it to your hand. Then, place the rest at the bottom of your deck in any order.',
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
                value: "Izo",
              },
            ],
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
        ],
      },
    ],
  },
  i18n: op07IzoSp003I18n,
};
