import type { CharacterCard } from "@tcg/op-types";
import { op11Ain002I18n } from "./002-ain.i18n.ts";

export const op11Ain002: CharacterCard = {
  id: "OP11-002",
  canonicalId: "OP11-002",
  slug: "ain/op11-002",
  name: "Ain",
  printings: [
    {
      id: "OP11-002",
      artId: "OP11-002",
      setCode: "OP11",
      collectorNumber: "002",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP11-002.jpg",
    },
  ],
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
    "[On Play] Give up to 1 of your opponent's Characters −1000 power during this turn. Then, K.O. up to 1 of your opponent's Characters with 0 power or less.",
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
            value: -1000,
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
