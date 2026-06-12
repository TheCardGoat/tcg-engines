import type { CharacterCard } from "@tcg/op-types";
import { op13Nekomamushi071I18n } from "./071-nekomamushi.i18n.ts";

export const op13Nekomamushi071: CharacterCard = {
  id: "OP13-071",
  cardType: "character",
  color: ["purple"],
  rarity: "UC",
  setId: "OP13",
  cost: 3,
  power: 3000,
  counter: 2000,
  traits: ["Minks Roger Pirates"],
  attribute: "slash",
  effect:
    "[On Play] If you have 8 or more DON!! cards on your field, K.O. up to 1 of your opponent's Characters with 3000 base power or less.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "donFieldCount",
            player: "self",
            comparison: "gte",
            value: 8,
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
                  filter: "basePower",
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
  i18n: op13Nekomamushi071I18n,
};
