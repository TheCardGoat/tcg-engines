import type { CharacterCard } from "@tcg/op-types";
import { eb03CharlotteFlampe032I18n } from "./032-charlotte-flampe.i18n.ts";

export const eb03CharlotteFlampe032: CharacterCard = {
  id: "EB03-032",
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "EB03",
  cost: 1,
  power: 2000,
  counter: 1000,
  traits: ["Big Mom Pirates"],
  attribute: "ranged",
  effect:
    "[Your Turn] [On Play] Up to 1 of your [Charlotte Katakuri] cards gains +2000 power during this turn.",
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
                  value: "Charlotte Katakuri",
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
  i18n: eb03CharlotteFlampe032I18n,
};
