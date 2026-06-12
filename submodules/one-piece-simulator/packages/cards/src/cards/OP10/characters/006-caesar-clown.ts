import type { CharacterCard } from "@tcg/op-types";
import { op10CaesarClown006I18n } from "./006-caesar-clown.i18n.ts";

export const op10CaesarClown006: CharacterCard = {
  id: "OP10-006",
  cardType: "character",
  color: ["red"],
  rarity: "UC",
  setId: "OP10",
  cost: 7,
  power: 7000,
  traits: ["Punk Hazard Scientist"],
  attribute: "special",
  effect:
    "[On Play] Look at 5 cards from the top of your deck; reveal up to 1 [Smiley] and add it to your hand. Then, place the rest at the bottom of your deck in any order and play up to 1 [Smiley] from your hand.",
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
                value: "Smiley",
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
                value: "Smiley",
              },
            ],
          },
        ],
      },
    ],
  },
  i18n: op10CaesarClown006I18n,
};
