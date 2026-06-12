import type { CharacterCard } from "@tcg/op-types";
import { op14eb04MissValentineMikitaDashPack087I18n } from "./087-miss-valentine-mikita-dash-pack.i18n.ts";

export const op14eb04MissValentineMikitaDashPack087: CharacterCard = {
  id: "OP14-087",
  cardType: "character",
  color: ["black"],
  rarity: "R",
  setId: "OP14EB04",
  cost: 1,
  power: 2000,
  counter: 1000,
  traits: ["Baroque Works"],
  attribute: "strike",
  effect:
    '[On Play] If your Leader\'s type includes "Baroque Works", look at 4 cards from the top of your deck; reveal up to 1 card with a type including "Baroque Works" other than [Miss.Valentine(Mikita)] and add it to your hand. Then, trash the rest.',
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Baroque Works",
          },
        ],
        actions: [
          {
            action: "search",
            lookCount: 4,
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
                value: "Miss.Valentine(Mikita)",
              },
            ],
            revealDestination: "hand",
            remainderPosition: "trash",
          },
        ],
      },
    ],
  },
  i18n: op14eb04MissValentineMikitaDashPack087I18n,
};
