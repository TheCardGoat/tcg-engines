import type { CharacterCard } from "@tcg/op-types";
import { op01XDrake054I18n } from "./054-x-drake.i18n.ts";

export const op01XDrake054: CharacterCard = {
  id: "OP01-054",
  cardType: "character",
  color: ["green"],
  rarity: "R",
  setId: "OP01",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["Drake Pirates Navy Supernovas"],
  attribute: "slash",
  effect:
    "[On Play] K.O. up to 1 of your opponent's rested Characters with a cost of 4 or less.  This card has been officially errata'd.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "ko",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "state",
                  value: "rested",
                },
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 4,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op01XDrake054I18n,
};
