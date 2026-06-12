import type { CharacterCard } from "@tcg/op-types";
import { op14eb04Kuro025I18n } from "./025-kuro.i18n.ts";

export const op14eb04Kuro025: CharacterCard = {
  id: "OP14-025",
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "OP14EB04",
  cost: 7,
  power: 8000,
  traits: ["East Blue Black Cat Pirates"],
  attribute: "slash",
  effect:
    "[On Play] If your Leader is [Kuro], play up to 1 {East Blue} type Character card with a cost of 6 or less from your hand.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "leaderName",
            name: "Kuro",
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
                value: 6,
              },
              {
                filter: "trait",
                value: "East Blue",
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
  i18n: op14eb04Kuro025I18n,
};
