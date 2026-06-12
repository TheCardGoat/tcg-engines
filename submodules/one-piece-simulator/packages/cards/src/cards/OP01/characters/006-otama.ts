import type { CharacterCard } from "@tcg/op-types";
import { op01Otama006I18n } from "./006-otama.i18n.ts";

export const op01Otama006: CharacterCard = {
  id: "OP01-006",
  cardType: "character",
  color: ["red"],
  rarity: "UC",
  setId: "OP01",
  cost: 1,
  power: 0,
  counter: 2000,
  traits: ["Land of Wano"],
  attribute: "special",
  effect:
    "[On Play] Give up to 1 of your opponent's Characters -2000 power during this turn.  This card has been officially errata'd.",
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
            value: -2000,
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: op01Otama006I18n,
};
