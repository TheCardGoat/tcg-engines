import type { CharacterCard } from "@tcg/op-types";
import { op09BuildingSnake008I18n } from "./008-building-snake.i18n.ts";

export const op09BuildingSnake008: CharacterCard = {
  id: "OP09-008",
  cardType: "character",
  color: ["red"],
  rarity: "UC",
  setId: "OP09",
  cost: 1,
  power: 2000,
  traits: ["Red-Haired Pirates"],
  attribute: "slash",
  effect:
    "[Activate: Main] You may place this Character at the bottom of the owner's deck: Give up to 1 of your opponent's Characters 3000 power during this turn.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
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
            value: 3000,
            duration: "thisTurn",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op09BuildingSnake008I18n,
};
