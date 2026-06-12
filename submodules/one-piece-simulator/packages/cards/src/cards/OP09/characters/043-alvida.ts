import type { CharacterCard } from "@tcg/op-types";
import { op09Alvida043I18n } from "./043-alvida.i18n.ts";

export const op09Alvida043: CharacterCard = {
  id: "OP09-043",
  cardType: "character",
  color: ["blue"],
  rarity: "UC",
  setId: "OP09",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["Cross Guild"],
  attribute: "strike",
  effect:
    '[On K.O.] If your Leader has the "Cross Guild" type, play up to 1 Character card with a cost of 5 or less other than [Alvida] from your hand.',
  effects: {
    effects: [
      {
        trigger: "onKo",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Cross Guild",
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
                filter: "excludeName",
                value: "Alvida",
              },
              {
                filter: "cost",
                comparison: "lte",
                value: 5,
              },
              {
                filter: "cardCategory",
                value: "character",
              },
            ],
          },
        ],
      },
    ],
  },
  i18n: op09Alvida043I18n,
};
