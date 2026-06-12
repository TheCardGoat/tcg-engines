import type { CharacterCard } from "@tcg/op-types";
import { op06Tokikake052I18n } from "./052-tokikake.i18n.ts";

export const op06Tokikake052: CharacterCard = {
  id: "OP06-052",
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "OP06",
  cost: 2,
  power: 3000,
  counter: 1000,
  traits: ["Navy"],
  attribute: "strike",
  effect:
    "[DON!! x1] If you have 4 or less cards in your hand, this Character cannot be K.O.'d in battle.",
  effects: {
    permanentEffects: [
      {
        conditions: [
          {
            condition: "donAttached",
            amount: 1,
          },
          {
            condition: "handCount",
            player: "self",
            comparison: "lte",
            value: 4,
          },
        ],
        actions: [
          {
            action: "cannotBeKod",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            duration: "permanent",
            restriction: "inBattle",
          },
        ],
      },
    ],
  },
  i18n: op06Tokikake052I18n,
};
