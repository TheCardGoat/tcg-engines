import type { CharacterCard } from "@tcg/op-types";
import { op10Hack051I18n } from "./051-hack.i18n.ts";

export const op10Hack051: CharacterCard = {
  id: "OP10-051",
  cardType: "character",
  color: ["blue"],
  rarity: "UC",
  setId: "OP10",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Fish-Man Revolutionary Army Dressrosa"],
  attribute: "strike",
  effect:
    '[DON!! x1] [When Attacking] Look at 3 cards from the top of your deck; reveal up to 1 "Revolutionary Army" type Character card and add it to your hand. Then, place the rest at the bottom of your deck in any order.',
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
        conditions: [
          {
            condition: "donAttached",
            amount: 1,
          },
        ],
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
                value: "Revolutionary Army",
              },
              {
                filter: "cardCategory",
                value: "character",
              },
            ],
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
        ],
      },
    ],
  },
  i18n: op10Hack051I18n,
};
