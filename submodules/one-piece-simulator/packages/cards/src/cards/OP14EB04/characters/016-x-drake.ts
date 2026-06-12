import type { CharacterCard } from "@tcg/op-types";
import { op14eb04XDrake016I18n } from "./016-x-drake.i18n.ts";

export const op14eb04XDrake016: CharacterCard = {
  id: "OP14-016",
  cardType: "character",
  color: ["red"],
  rarity: "R",
  setId: "OP14EB04",
  cost: 5,
  power: 7000,
  traits: ["Drake Pirates Navy Supernovas"],
  attribute: "slash",
  effect:
    "[Opponent's Turn] [Once Per Turn] If your {Supernovas} type Character would be removed from the field by your opponent's effect, you may give your Leader 2000 power during this turn instead.\n[DON!! x1] [When Attacking] Give up to 1 of your opponent's Characters 2000 power during this turn.",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
        conditions: [
          {
            condition: "donAttached",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: 2000,
            duration: "thisTurn",
          },
        ],
      },
    ],
    replacementEffects: [
      {
        replacedEvent: "removeFromField",
        replacementAction: {
          action: "modifyPower",
          target: {
            player: "self",
            zones: ["leader"],
            count: {
              amount: 1,
            },
          },
          value: 2000,
          duration: "thisTurn",
        },
        conditions: [
          {
            condition: "turn",
            value: "opponent",
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: op14eb04XDrake016I18n,
};
