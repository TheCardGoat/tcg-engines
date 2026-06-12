import type { CharacterCard } from "@tcg/op-types";
import { op07Porchemy012I18n } from "./012-porchemy.i18n.ts";

export const op07Porchemy012: CharacterCard = {
  id: "OP07-012",
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "OP07",
  cost: 2,
  power: 3000,
  counter: 1000,
  traits: ["Goa Kingdom Bluejam Pirates"],
  attribute: "slash",
  effect: "[On Play] Give up to 1 of your opponent's Characters -1000 power during this turn.",
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
            value: -1000,
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: op07Porchemy012I18n,
};
