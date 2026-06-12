import type { CharacterCard } from "@tcg/op-types";
import { op04Koza006I18n } from "./006-koza.i18n.ts";

export const op04Koza006: CharacterCard = {
  id: "OP04-006",
  cardType: "character",
  color: ["red"],
  rarity: "UC",
  setId: "OP04",
  cost: 3,
  power: 3000,
  counter: 2000,
  traits: ["Alabasta"],
  attribute: "slash",
  effect:
    "[When Attacking] You may give your 1 active Leader -5000 power during this turn: This Character gains +2000 power until the start of your next turn.",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
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
            duration: "untilStartOfNextTurn",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op04Koza006I18n,
};
