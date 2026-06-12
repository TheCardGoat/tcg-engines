import type { CharacterCard } from "@tcg/op-types";
import { op12TrafalgarLammy105I18n } from "./105-trafalgar-lammy.i18n.ts";

export const op12TrafalgarLammy105: CharacterCard = {
  id: "OP12-105",
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "OP12",
  cost: 1,
  power: 0,
  counter: 2000,
  traits: ["Flevance"],
  attribute: "wisdom",
  effect:
    "[Your Turn] [On Play] Up to 1 of your [Trafalgar Law] cards gains +2000 power during this turn.",
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
                  value: "Trafalgar Law",
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
  i18n: op12TrafalgarLammy105I18n,
};
