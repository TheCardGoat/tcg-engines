import type { CharacterCard } from "@tcg/op-types";
import { eb03Monet010I18n } from "./010-monet.i18n.ts";

export const eb03Monet010: CharacterCard = {
  id: "EB03-010",
  cardType: "character",
  color: ["red"],
  rarity: "R",
  setId: "EB03",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["Donquixote Pirates Punk Hazard"],
  attribute: "special",
  effect:
    "[Blocker] [On Play] Look at 5 cards from the top of your deck; reveal up to 1 Character card with 1000 power or less or up to 1 Event card and add it to your hand. Then, place the rest at the bottom of your deck in any order.",
  effects: {
    keywords: ["blocker"],
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
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
        ],
      },
    ],
  },
  i18n: eb03Monet010I18n,
};
