import type { CharacterCard } from "@tcg/op-types";
import { op05Mozambia053I18n } from "./053-mozambia.i18n.ts";

export const op05Mozambia053: CharacterCard = {
  id: "OP05-053",
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "OP05",
  cost: 1,
  power: 2000,
  counter: 1000,
  traits: ["Navy"],
  attribute: "slash",
  effect:
    "[Your Turn][Once Per Turn] When you draw a card outside of your Draw Phase, this Character gains +2000 power during this turn.",
  effects: {
    effects: [
      {
        trigger: "whenCardDrawn",
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
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            value: 2000,
            duration: "thisTurn",
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: op05Mozambia053I18n,
};
