import type { CharacterCard } from "@tcg/op-types";
import { op07Hattori088I18n } from "./088-hattori.i18n.ts";

export const op07Hattori088: CharacterCard = {
  id: "OP07-088",
  cardType: "character",
  color: ["black"],
  rarity: "UC",
  setId: "OP07",
  cost: 1,
  power: 0,
  counter: 2000,
  traits: ["Animal CP0"],
  attribute: "strike",
  effect:
    "[Your Turn] [On Play] Up to 1 of your [Rob Lucci] cards gains +2000 power during this turn.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "turn",
            value: "your",
          },
        ],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["leader", "character", "stage", "costArea"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "name",
                  value: "Rob Lucci",
                },
              ],
            },
            value: 2000,
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: op07Hattori088I18n,
};
