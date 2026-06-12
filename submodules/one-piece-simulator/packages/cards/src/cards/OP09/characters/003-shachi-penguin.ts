import type { CharacterCard } from "@tcg/op-types";
import { op09ShachiPenguin003I18n } from "./003-shachi-penguin.i18n.ts";

export const op09ShachiPenguin003: CharacterCard = {
  id: "OP09-003",
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "OP09",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Heart Pirates"],
  attribute: "ranged",
  effect:
    "[When Attacking] Give up to 1 of your opponent's Characters 2000 power during this turn.",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
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
            value: 2000,
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: op09ShachiPenguin003I18n,
};
