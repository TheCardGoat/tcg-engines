import type { CharacterCard } from "@tcg/op-types";
import { op12Shakuyaku006I18n } from "./006-shakuyaku.i18n.ts";

export const op12Shakuyaku006: CharacterCard = {
  id: "OP12-006",
  cardType: "character",
  color: ["red"],
  rarity: "R",
  setId: "OP12",
  cost: 1,
  power: 2000,
  counter: 1000,
  traits: ["Amazon Lily"],
  attribute: "wisdom",
  effect:
    "[On Play] Look at 5 cards from the top of your deck; reveal up to 1 [Monkey.D.Luffy] or 1 red Event and add it to your hand. Then, place the rest at the bottom of your deck in any order.",
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
                value: "Monkey.D.Luffy",
              },
            ],
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
        ],
      },
    ],
  },
  i18n: op12Shakuyaku006I18n,
};
