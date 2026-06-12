import type { CharacterCard } from "@tcg/op-types";
import { op02Makino015I18n } from "./015-makino.i18n.ts";

export const op02Makino015: CharacterCard = {
  id: "OP02-015",
  cardType: "character",
  color: ["red"],
  rarity: "UC",
  setId: "OP02",
  cost: 1,
  power: 0,
  counter: 2000,
  traits: ["Windmill Village"],
  attribute: "wisdom",
  effect:
    "[Activate:Main] You may rest this Character: Up to 1 of your red Characters with a cost of 1 gains +3000 power during this turn.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "restThisCard",
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
                  filter: "color",
                  value: "red",
                },
                {
                  filter: "cost",
                  comparison: "eq",
                  value: 1,
                },
              ],
            },
            value: 3000,
            duration: "thisTurn",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op02Makino015I18n,
};
