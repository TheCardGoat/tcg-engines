import type { CharacterCard } from "@tcg/op-types";
import { op05OneLeggedToySoldier081I18n } from "./081-one-legged-toy-soldier.i18n.ts";

export const op05OneLeggedToySoldier081: CharacterCard = {
  id: "OP05-081",
  cardType: "character",
  color: ["black"],
  rarity: "UC",
  setId: "OP05",
  cost: 2,
  power: 0,
  counter: 2000,
  traits: ["Dressrosa"],
  attribute: "strike",
  effect:
    "[Activate:Main] You may trash this Character: Give up to 1 of your opponent's Characters -3 cost during this turn.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "trashThisCard",
          },
        ],
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
            },
            value: -3,
            duration: "thisTurn",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op05OneLeggedToySoldier081I18n,
};
