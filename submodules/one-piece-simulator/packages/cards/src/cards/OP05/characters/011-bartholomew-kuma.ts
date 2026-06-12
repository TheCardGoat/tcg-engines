import type { CharacterCard } from "@tcg/op-types";
import { op05BartholomewKuma011I18n } from "./011-bartholomew-kuma.i18n.ts";

export const op05BartholomewKuma011: CharacterCard = {
  id: "OP05-011",
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "OP05",
  cost: 2,
  power: 2000,
  counter: 1000,
  traits: ["Revolutionary Army The Seven Warlords of the Sea"],
  attribute: "strike",
  effect:
    "[On Play] K.O. up to 1 of your opponent's Characters with 2000 power or less. [Trigger] If your Leader is multicolored, play this card.",
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
                  value: 2000,
                },
              ],
            },
          },
        ],
      },
      {
        trigger: "trigger",
        conditions: [
          {
            condition: "leaderMulticolored",
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
            },
          },
        ],
      },
    ],
  },
  i18n: op05BartholomewKuma011I18n,
};
