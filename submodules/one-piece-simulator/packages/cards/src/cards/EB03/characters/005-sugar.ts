import type { CharacterCard } from "@tcg/op-types";
import { eb03Sugar005I18n } from "./005-sugar.i18n.ts";

export const eb03Sugar005: CharacterCard = {
  id: "EB03-005",
  cardType: "character",
  color: ["red"],
  rarity: "R",
  setId: "EB03",
  cost: 3,
  power: 0,
  counter: 1000,
  traits: ["Donquixote Pirates"],
  attribute: "special",
  effect:
    "[On Play] If your Leader is [Sugar], play up to 1 {Donquixote Pirates} type Character card with 6000 power or less from your hand rested.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "leaderName",
            name: "Sugar",
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
              upTo: true,
            },
            filters: [
              {
                filter: "power",
                comparison: "lte",
                value: 6000,
              },
              {
                filter: "trait",
                value: "Donquixote Pirates",
              },
              {
                filter: "cardCategory",
                value: "character",
              },
            ],
            playState: "rested",
          },
        ],
      },
    ],
  },
  i18n: eb03Sugar005I18n,
};
