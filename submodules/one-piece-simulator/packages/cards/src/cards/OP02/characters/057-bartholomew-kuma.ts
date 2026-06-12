import type { CharacterCard } from "@tcg/op-types";
import { op02BartholomewKuma057I18n } from "./057-bartholomew-kuma.i18n.ts";

export const op02BartholomewKuma057: CharacterCard = {
  id: "OP02-057",
  cardType: "character",
  color: ["blue"],
  rarity: "UC",
  setId: "OP02",
  cost: 3,
  power: 3000,
  counter: 1000,
  traits: ["Revolutionary Army The Seven Warlords of the Sea"],
  attribute: "strike",
  effect:
    "[On Play] Look at 2 cards from the top of your deck; reveal up to 1 [The Seven Warlords of the Sea] type card and add it to your hand. Then, place the rest at the top or bottom of the deck in any order.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "search",
            lookCount: 2,
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
                value: "The Seven Warlords of the Sea",
              },
            ],
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
        ],
      },
    ],
  },
  i18n: op02BartholomewKuma057I18n,
};
