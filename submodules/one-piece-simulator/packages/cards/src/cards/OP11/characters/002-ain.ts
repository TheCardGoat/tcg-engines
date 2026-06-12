import type { CharacterCard } from "@tcg/op-types";
import { op11Ain002I18n } from "./002-ain.i18n.ts";

export const op11Ain002: CharacterCard = {
  id: "OP11-002",
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "OP11",
  cost: 3,
  power: 4000,
  counter: 1000,
  traits: ["FILM Neo Navy"],
  attribute: "special",
  effect:
    "[On Play] Give up to 1 of your opponent's Characters 1000 power during this turn. Then, K.O. up to 1 of your opponent's Characters with 0 power or less.",
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
            value: 1000,
            duration: "thisTurn",
          },
          {
            action: "ko",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "power",
                  comparison: "lte",
                  value: 0,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op11Ain002I18n,
};
