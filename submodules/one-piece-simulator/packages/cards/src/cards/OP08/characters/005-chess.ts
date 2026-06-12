import type { CharacterCard } from "@tcg/op-types";
import { op08Chess005I18n } from "./005-chess.i18n.ts";

export const op08Chess005: CharacterCard = {
  id: "OP08-005",
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "OP08",
  cost: 3,
  power: 3000,
  counter: 1000,
  traits: ["Drum Kingdom"],
  attribute: "ranged",
  effect:
    "[On Play] Give up to 1 of your opponent's Characters 2000 power during this turn. Then, if you don't have [Kuromarimo], play up to 1 [Kuromarimo] from your hand.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: 2000,
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: op08Chess005I18n,
};
