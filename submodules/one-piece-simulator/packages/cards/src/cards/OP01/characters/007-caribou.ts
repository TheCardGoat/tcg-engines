import type { CharacterCard } from "@tcg/op-types";
import { op01Caribou007I18n } from "./007-caribou.i18n.ts";

export const op01Caribou007: CharacterCard = {
  id: "OP01-007",
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "OP01",
  cost: 3,
  power: 4000,
  counter: 1000,
  traits: ["Caribou Pirates Supernovas"],
  attribute: "special",
  effect:
    "[On K.O.] K.O. up to 1 of your opponent's Characters with 4000 power or less.  This card has been officially errata'd.",
  effects: {
    effects: [
      {
        trigger: "onKo",
        actions: [
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
                  value: 4000,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op01Caribou007I18n,
};
