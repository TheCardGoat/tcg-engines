import type { CharacterCard } from "@tcg/op-types";
import { prb02UtaReprint002I18n } from "./002-uta-reprint.i18n.ts";

export const prb02UtaReprint002: CharacterCard = {
  id: "OP09-002",
  cardType: "character",
  color: ["red"],
  rarity: "R",
  setId: "PRB02",
  cost: 1,
  power: 2000,
  counter: 1000,
  traits: ["FILM"],
  attribute: "special",
  effect:
    '[On Play] Look at 5 cards from the top of your deck; reveal up to 1 "Red-Haired Pirates" type card and add it to your hand. Then, place the rest at the bottom of your deck in any order.Disclaimer: This card was reprinted from the original set with changes to the copyright information (Note: the original print did not include "EN" at the end of the copyright).',
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
                filter: "trait",
                value: "Red-Haired Pirates",
              },
            ],
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
        ],
      },
    ],
  },
  i18n: prb02UtaReprint002I18n,
};
