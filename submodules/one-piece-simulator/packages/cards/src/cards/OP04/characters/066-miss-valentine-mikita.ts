import type { CharacterCard } from "@tcg/op-types";
import { op04MissValentineMikita066I18n } from "./066-miss-valentine-mikita.i18n.ts";

export const op04MissValentineMikita066: CharacterCard = {
  id: "OP04-066",
  cardType: "character",
  color: ["purple"],
  rarity: "R",
  setId: "OP04",
  cost: 2,
  power: 2000,
  counter: 1000,
  traits: ["Baroque Works"],
  attribute: "strike",
  effect:
    '[On Play] Look at 5 cards from the top of your deck; reveal up to 1 card with a type including "Baroque Works" and add it to your hand. Then, place the rest at the bottom of your deck in any order. [Trigger] DON!! -1 (You may return the specified number of DON!! cards from your field to your DON!! deck.): Play this card.',
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
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
        ],
      },
      {
        trigger: "trigger",
        costs: [
          {
            cost: "returnDon",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "play",
            source: {
              player: "self",
              zone: "hand",
            },
            count: {
              amount: 1,
            },
          },
        ],
      },
    ],
  },
  i18n: op04MissValentineMikita066I18n,
};
