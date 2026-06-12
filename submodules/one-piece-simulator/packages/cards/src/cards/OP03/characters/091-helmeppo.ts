import type { CharacterCard } from "@tcg/op-types";
import { op03Helmeppo091I18n } from "./091-helmeppo.i18n.ts";

export const op03Helmeppo091: CharacterCard = {
  id: "OP03-091",
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "OP03",
  cost: 1,
  power: 0,
  counter: 1000,
  traits: ["Navy"],
  attribute: "wisdom",
  effect:
    "[On Play] Set the cost of up to 1 of your opponent's Characters with no base effect to 0 during this turn.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "modifyCost",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "noBaseEffect",
                },
              ],
            },
            value: 0,
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: op03Helmeppo091I18n,
};
