import type { CharacterCard } from "@tcg/op-types";
import { op04Igaram002I18n } from "./002-igaram.i18n.ts";

export const op04Igaram002: CharacterCard = {
  id: "OP04-002",
  cardType: "character",
  color: ["red"],
  rarity: "R",
  setId: "OP04",
  cost: 2,
  power: 3000,
  counter: 1000,
  traits: ["Alabasta"],
  attribute: "ranged",
  effect:
    "[Activate:Main] You may rest this Character and give your 1 active Leader -5000 power during this turn: Look at 5 cards from the top of your deck; reveal up to 1 [Alabasta] type card and add it to your hand. Then, place the rest at the bottom of your deck in any order.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "restThisCard",
          },
        ],
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
                value: "Alabasta",
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
  i18n: op04Igaram002I18n,
};
