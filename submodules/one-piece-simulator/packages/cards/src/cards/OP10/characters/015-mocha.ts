import type { CharacterCard } from "@tcg/op-types";
import { op10Mocha015I18n } from "./015-mocha.i18n.ts";

export const op10Mocha015: CharacterCard = {
  id: "OP10-015",
  cardType: "character",
  color: ["red"],
  rarity: "UC",
  setId: "OP10",
  cost: 3,
  power: 3000,
  counter: 2000,
  traits: ["Punk Hazard"],
  attribute: "strike",
  effect: "[On Play] Give up to 1 of your opponent's Characters 1000 power during this turn.",
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
    ],
  },
  i18n: op10Mocha015I18n,
};
