import type { CharacterCard } from "@tcg/op-types";
import { eb01Koza004I18n } from "./004-koza.i18n.ts";

export const eb01Koza004: CharacterCard = {
  id: "EB01-004",
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "EB01",
  cost: 2,
  power: 3000,
  counter: 1000,
  traits: ["Alabasta"],
  attribute: "ranged",
  effect:
    "[When Attacking] You may give your 1 active Leader -5000 power during this turn: Give up to 1 of your opponent's Characters -3000 power during this turn.",
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
            value: -3000,
            duration: "thisTurn",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: eb01Koza004I18n,
};
