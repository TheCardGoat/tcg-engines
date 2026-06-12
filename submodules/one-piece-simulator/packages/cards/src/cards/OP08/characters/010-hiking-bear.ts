import type { CharacterCard } from "@tcg/op-types";
import { op08HikingBear010I18n } from "./010-hiking-bear.i18n.ts";

export const op08HikingBear010: CharacterCard = {
  id: "OP08-010",
  cardType: "character",
  color: ["red"],
  rarity: "UC",
  setId: "OP08",
  cost: 3,
  power: 3000,
  counter: 2000,
  traits: ["Animal Drum Kingdom"],
  attribute: "wisdom",
  effect:
    "[DON!! x1] [Activate: Main] [Once Per Turn] Up to 1 of your [Animal] type Characters other than this Character gains +1000 power during this turn.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        conditions: [
          {
            condition: "donAttached",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "trait",
                  value: "Animal",
                },
                {
                  filter: "excludeSelf",
                },
              ],
            },
            value: 1000,
            duration: "thisTurn",
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: op08HikingBear010I18n,
};
