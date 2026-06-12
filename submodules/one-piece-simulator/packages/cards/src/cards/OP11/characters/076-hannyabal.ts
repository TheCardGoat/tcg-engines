import type { CharacterCard } from "@tcg/op-types";
import { op11Hannyabal076I18n } from "./076-hannyabal.i18n.ts";

export const op11Hannyabal076: CharacterCard = {
  id: "OP11-076",
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "OP11",
  cost: 5,
  power: 5000,
  counter: 1000,
  traits: ["Impel Down"],
  attribute: "slash",
  effect:
    '[Blocker]\n[On Play] If your Leader has the "Impel Down" type, play up to 1 "Impel Down" type Character card with a cost of 3 or less from your hand.',
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Impel Down",
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
                filter: "cost",
                comparison: "lte",
                value: 3,
              },
              {
                filter: "trait",
                value: "Impel Down",
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
  i18n: op11Hannyabal076I18n,
};
