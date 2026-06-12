import type { CharacterCard } from "@tcg/op-types";
import { op10Violet062I18n } from "./062-violet.i18n.ts";

export const op10Violet062: CharacterCard = {
  id: "OP10-062",
  cardType: "character",
  color: ["purple"],
  rarity: "R",
  setId: "OP10",
  cost: 3,
  power: 4000,
  counter: 1000,
  traits: ["Donquixote Pirates"],
  attribute: "special",
  effect:
    '[Blocker]\n[On K.O.] DON!! 1: If your Leader has the "Donquixote Pirates" type, add up to 1 purple Event from your trash to your hand.',
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onKo",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Donquixote Pirates",
          },
        ],
        costs: [
          {
            cost: "returnDon",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "returnToHand",
            target: {
              player: "self",
              zones: ["trash"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "color",
                  value: "purple",
                },
                {
                  filter: "cardCategory",
                  value: "event",
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op10Violet062I18n,
};
