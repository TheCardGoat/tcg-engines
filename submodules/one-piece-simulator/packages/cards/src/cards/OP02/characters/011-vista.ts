import type { CharacterCard } from "@tcg/op-types";
import { op02Vista011I18n } from "./011-vista.i18n.ts";

export const op02Vista011: CharacterCard = {
  id: "OP02-011",
  cardType: "character",
  color: ["red"],
  rarity: "R",
  setId: "OP02",
  cost: 3,
  power: 3000,
  counter: 1000,
  traits: ["Whitebeard Pirates"],
  attribute: "slash",
  effect: "[On Play] K.O. up to 1 of your opponent's Characters with 3000 power or less.",
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
                  value: 3000,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op02Vista011I18n,
};
