import type { CharacterCard } from "@tcg/op-types";
import { op07Moda014I18n } from "./014-moda.i18n.ts";

export const op07Moda014: CharacterCard = {
  id: "OP07-014",
  cardType: "character",
  color: ["red"],
  rarity: "UC",
  setId: "OP07",
  cost: 1,
  power: 0,
  counter: 2000,
  traits: ["Lulucia Kingdom"],
  attribute: "wisdom",
  effect:
    "[Your Turn][On Play] Up to 1 of your [Portgas.D.Ace] cards gains +2000 power during this turn.",
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
                  value: "Portgas.D.Ace",
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
  i18n: op07Moda014I18n,
};
