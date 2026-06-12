import type { CharacterCard } from "@tcg/op-types";
import { op11Shirley104I18n } from "./104-shirley.i18n.ts";

export const op11Shirley104: CharacterCard = {
  id: "OP11-104",
  cardType: "character",
  color: ["yellow"],
  rarity: "R",
  setId: "OP11",
  cost: 3,
  power: 4000,
  counter: 1000,
  traits: ["Merfolk Fish-Man Island"],
  attribute: "wisdom",
  effect:
    '[Blocker]\n[On Play] You may turn 1 card from the top of your Life cards face-down: Look at 3 cards from the top of your deck; reveal up to 1 "Fish-Man Island" type card and add it to your hand. Then, place the rest at the top or bottom of the deck in any order.',
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "turnLifeFaceUp",
            count: 1,
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
                value: "Fish-Man Island",
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
  i18n: op11Shirley104I18n,
};
