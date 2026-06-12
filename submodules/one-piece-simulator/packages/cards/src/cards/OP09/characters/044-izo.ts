import type { CharacterCard } from "@tcg/op-types";
import { op09Izo044I18n } from "./044-izo.i18n.ts";

export const op09Izo044: CharacterCard = {
  id: "OP09-044",
  cardType: "character",
  color: ["blue"],
  rarity: "UC",
  setId: "OP09",
  cost: 3,
  power: 4000,
  counter: 1000,
  traits: ["Land of Wano Whitebeard Pirates"],
  attribute: "ranged",
  effect:
    '[When Attacking] Look at 5 cards from the top of your deck; reveal up to 1 "Land of Wano" type card or card with a type including "Whitebeard Pirates" and add it to your hand. Then, place the rest at the bottom of your deck in any order and trash 1 card from your hand.',
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
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
                value: "Land of Wano",
              },
            ],
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
          {
            action: "trashFromHand",
            player: "self",
            amount: 1,
          },
        ],
      },
    ],
  },
  i18n: op09Izo044I18n,
};
