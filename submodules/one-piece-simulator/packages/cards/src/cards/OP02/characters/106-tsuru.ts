import type { CharacterCard } from "@tcg/op-types";
import { op02Tsuru106I18n } from "./106-tsuru.i18n.ts";

export const op02Tsuru106: CharacterCard = {
  id: "OP02-106",
  cardType: "character",
  color: ["black"],
  rarity: "UC",
  setId: "OP02",
  cost: 1,
  power: 0,
  counter: 2000,
  traits: ["Navy"],
  attribute: "wisdom",
  effect: "[On Play] Give up to 1 of your opponent's Characters -2 cost during this turn.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "modifyCost",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: -2,
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: op02Tsuru106I18n,
};
