import type { CharacterCard } from "@tcg/op-types";
import { op03Buggy008I18n } from "./008-buggy.i18n.ts";

export const op03Buggy008: CharacterCard = {
  id: "OP03-008",
  cardType: "character",
  color: ["red"],
  rarity: "UC",
  setId: "OP03",
  cost: 1,
  power: 3000,
  traits: ["Buggy Pirates"],
  attribute: "slash",
  effect:
    'This Character cannot be K.O.\'d in battle by "Slash" attribute cards. [On Play] Look at 5 cards from the top of your deck; reveal up to 1 red Event and add it to your hand. Then, place the rest at the bottom of your deck in any order.',
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
                filter: "color",
                value: "red",
              },
              {
                filter: "cardCategory",
                value: "event",
              },
            ],
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
        ],
      },
    ],
  },
  i18n: op03Buggy008I18n,
};
