import type { CharacterCard } from "@tcg/op-types";
import { op10VinsmokeSanji063I18n } from "./063-vinsmoke-sanji.i18n.ts";

export const op10VinsmokeSanji063: CharacterCard = {
  id: "OP10-063",
  cardType: "character",
  color: ["purple"],
  rarity: "R",
  setId: "OP10",
  cost: 1,
  power: 2000,
  counter: 1000,
  traits: ["The Vinsmoke Family Kingdom of GERMA"],
  attribute: "strike",
  effect:
    '[On Play] If your Leader\'s type includes "GERMA", look at 5 cards from the top of your deck; reveal up to 1 card with a type including "GERMA" and add it to your hand. Then, place the rest at the bottom of your deck in any order.',
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "GERMA",
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
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
        ],
      },
    ],
  },
  i18n: op10VinsmokeSanji063I18n,
};
