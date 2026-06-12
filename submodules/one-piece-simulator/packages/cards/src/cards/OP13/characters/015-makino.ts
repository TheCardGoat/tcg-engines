import type { CharacterCard } from "@tcg/op-types";
import { op13Makino015I18n } from "./015-makino.i18n.ts";

export const op13Makino015: CharacterCard = {
  id: "OP13-015",
  cardType: "character",
  color: ["red"],
  rarity: "UC",
  setId: "OP13",
  cost: 1,
  power: 0,
  counter: 2000,
  traits: ["Windmill Village"],
  attribute: "wisdom",
  effect:
    "[Activate: Main] You may rest this Character: Up to 1 of your [Monkey.D.Luffy] cards gains +2000 power during this turn.",
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
              zones: ["leader", "character", "stage", "costArea"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "name",
                  value: "Monkey.D.Luffy",
                },
              ],
            },
            value: 2000,
            duration: "thisTurn",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op13Makino015I18n,
};
