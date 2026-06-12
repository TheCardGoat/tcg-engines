import type { CharacterCard } from "@tcg/op-types";
import { op08Buckin051I18n } from "./051-buckin.i18n.ts";

export const op08Buckin051: CharacterCard = {
  id: "OP08-051",
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "OP08",
  cost: 1,
  power: 2000,
  counter: 1000,
  traits: ["Former Rocks Pirates"],
  attribute: "wisdom",
  effect:
    "[Your Turn] [On Play] Up to 1 of your [Edward Weevil] cards gains +2000 power during this turn.",
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
                  value: "Edward Weevil",
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
  i18n: op08Buckin051I18n,
};
