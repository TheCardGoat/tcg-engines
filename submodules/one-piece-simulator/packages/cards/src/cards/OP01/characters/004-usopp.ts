import type { CharacterCard } from "@tcg/op-types";
import { op01Usopp004I18n } from "./004-usopp.i18n.ts";

export const op01Usopp004: CharacterCard = {
  id: "OP01-004",
  cardType: "character",
  color: ["red"],
  rarity: "R",
  setId: "OP01",
  cost: 2,
  power: 3000,
  counter: 2000,
  traits: ["Straw Hat Crew"],
  attribute: "ranged",
  effect:
    "[DON!! x1] [Your Turn] [Once Per Turn] Draw 1 card when your opponent activates an Event.",
  effects: {
    effects: [
      {
        trigger: "whenOpponentActivatesEvent",
        conditions: [
          {
            condition: "donAttached",
            amount: 1,
          },
          {
            condition: "turn",
            value: "your",
          },
        ],
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: op01Usopp004I18n,
};
