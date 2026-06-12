import type { CharacterCard } from "@tcg/op-types";
import { op11Franky012I18n } from "./012-franky.i18n.ts";

export const op11Franky012: CharacterCard = {
  id: "OP11-012",
  cardType: "character",
  color: ["red"],
  rarity: "UC",
  setId: "OP11",
  cost: 4,
  power: 4000,
  counter: 2000,
  traits: ["Navy SWORD"],
  attribute: "strike",
  effect:
    "[Your Turn] [Once Per Turn] When your opponent activates an Event, all of your Characters gain +2000 power during this turn.",
  effects: {
    effects: [
      {
        trigger: "whenOpponentActivatesEvent",
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
                amount: "all",
              },
            },
            value: 2000,
            duration: "thisTurn",
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: op11Franky012I18n,
};
