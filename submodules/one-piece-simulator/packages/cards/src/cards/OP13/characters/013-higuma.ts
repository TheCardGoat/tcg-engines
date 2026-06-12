import type { CharacterCard } from "@tcg/op-types";
import { op13Higuma013I18n } from "./013-higuma.i18n.ts";

export const op13Higuma013: CharacterCard = {
  id: "OP13-013",
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "OP13",
  cost: 1,
  power: 3000,
  traits: ["Mountain Bandits Mountain Bandits"],
  attribute: "slash",
  effect: "[On Play] K.O. up to 1 of your opponent's Characters with 0 power or less.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
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
                  value: 0,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op13Higuma013I18n,
};
