import type { CharacterCard } from "@tcg/op-types";
import { op09Lindbergh114I18n } from "./114-lindbergh.i18n.ts";

export const op09Lindbergh114: CharacterCard = {
  id: "OP09-114",
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "OP09",
  cost: 3,
  power: 4000,
  counter: 1000,
  trigger: "If you and your opponent have a total of 5 or less Life cards, play this card.",
  traits: ["Minks Revolutionary Army"],
  attribute: "special",
  effect:
    "[On Play] If you and your opponent have a total of 5 or less Life cards, K.O. up to 1 of your opponent's Characters with 2000 power or less.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "lifeCount",
            player: "self",
            comparison: "lte",
            value: 5,
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
                  value: 2000,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op09Lindbergh114I18n,
};
