import type { CharacterCard } from "@tcg/op-types";
import { op14eb04Tashigi029I18n } from "./029-tashigi.i18n.ts";

export const op14eb04Tashigi029: CharacterCard = {
  id: "OP14-029",
  cardType: "character",
  color: ["green"],
  rarity: "R",
  setId: "OP14EB04",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["Navy"],
  attribute: "slash",
  effect:
    "[Opponent's Turn] If this Character would be removed from the field by your opponent's effect, you may rest 1 of your cards instead.\n[Activate: Main] [Once Per Turn] You may rest 2 of your cards: This Character gains +2000 power until the end of your opponent's next End Phase.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "restCards",
            amount: 2,
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
              },
              self: true,
            },
            value: 2000,
            duration: "untilEndOfOpponentNextEndPhase",
          },
        ],
        optional: true,
        oncePerTurn: true,
      },
    ],
    replacementEffects: [
      {
        replacedEvent: "removeFromField",
        replacementAction: {
          action: "rest",
          target: {
            player: "self",
            zones: ["leader", "character", "stage", "costArea"],
            count: {
              amount: 1,
            },
          },
        },
        conditions: [
          {
            condition: "turn",
            value: "opponent",
          },
        ],
      },
    ],
  },
  i18n: op14eb04Tashigi029I18n,
};
