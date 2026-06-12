import type { CharacterCard } from "@tcg/op-types";
import { op08Kuromarimo004I18n } from "./004-kuromarimo.i18n.ts";

export const op08Kuromarimo004: CharacterCard = {
  id: "OP08-004",
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "OP08",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Drum Kingdom"],
  attribute: "strike",
  effect:
    "[On Play] If you have [Chess], K.O. up to 1 of your opponent's Characters with 3000 power or less.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "hasCard",
            player: "self",
            zone: "field",
            filters: [
              {
                filter: "name",
                value: "Chess",
              },
            ],
          },
        ],
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
  i18n: op08Kuromarimo004I18n,
};
