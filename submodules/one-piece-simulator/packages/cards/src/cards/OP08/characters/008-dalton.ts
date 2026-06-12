import type { CharacterCard } from "@tcg/op-types";
import { op08Dalton008I18n } from "./008-dalton.i18n.ts";

export const op08Dalton008: CharacterCard = {
  id: "OP08-008",
  cardType: "character",
  color: ["red"],
  rarity: "R",
  setId: "OP08",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["Drum Kingdom"],
  attribute: "slash",
  effect:
    "[On Play] Give up to 1 of your opponent's Characters 1000 power during this turn. [DON!! x1] [Activate: Main] [Once Per Turn] You may add 1 card from the top of your Life cards to your hand: This Character gains [Rush] during this turn. (This card can attack on the turn in which it is played.)",
  effects: {
    effects: [
      {
        trigger: "onPlay",
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
            value: 1000,
            duration: "thisTurn",
          },
        ],
      },
      {
        trigger: "activateMain",
        conditions: [
          {
            condition: "donAttached",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "grantKeyword",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            keyword: "rush",
            duration: "thisTurn",
          },
        ],
        optional: true,
        oncePerTurn: true,
      },
    ],
  },
  i18n: op08Dalton008I18n,
};
