import type { CharacterCard } from "@tcg/op-types";
import { op05Killer064I18n } from "./064-killer.i18n.ts";

export const op05Killer064: CharacterCard = {
  id: "OP05-064",
  cardType: "character",
  color: ["purple"],
  rarity: "R",
  setId: "OP05",
  cost: 1,
  power: 2000,
  counter: 1000,
  traits: ["Kid Pirates"],
  attribute: "slash",
  effect:
    "[On Play] Look at 5 cards from the top of your deck; reveal up to 1 [Kid Pirates] type card other than [Killer] and add it to your hand. Then, place the rest at the bottom of your deck in any order.",
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
                value: "Killer",
              },
              {
                filter: "trait",
                value: "Kid Pirates",
              },
            ],
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
        ],
      },
    ],
  },
  i18n: op05Killer064I18n,
};
