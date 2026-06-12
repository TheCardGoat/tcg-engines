import type { CharacterCard } from "@tcg/op-types";
import { op05LieutenantSpacey107I18n } from "./107-lieutenant-spacey.i18n.ts";

export const op05LieutenantSpacey107: CharacterCard = {
  id: "OP05-107",
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "OP05",
  cost: 3,
  power: 4000,
  counter: 1000,
  traits: ["The Moon"],
  attribute: "ranged",
  effect:
    "[Your Turn][Once Per Turn] When a card is added to your hand from your Life, this Character gains +2000 power during this turn.",
  effects: {
    effects: [
      {
        trigger: "whenLifeAddedToHand",
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
  i18n: op05LieutenantSpacey107I18n,
};
