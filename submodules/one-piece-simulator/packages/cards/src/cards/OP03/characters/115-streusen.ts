import type { CharacterCard } from "@tcg/op-types";
import { op03Streusen115I18n } from "./115-streusen.i18n.ts";

export const op03Streusen115: CharacterCard = {
  id: "OP03-115",
  cardType: "character",
  color: ["yellow"],
  rarity: "R",
  setId: "OP03",
  cost: 1,
  power: 1000,
  counter: 2000,
  traits: ["Big Mom Pirates"],
  attribute: "slash",
  effect:
    "[On Play] You may trash 1 card with a [Trigger] from your hand: K.O. up to 1 of your opponent's Characters with a cost of 1 or less.",
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
                  filter: "cost",
                  comparison: "lte",
                  value: 1,
                },
              ],
            },
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op03Streusen115I18n,
};
