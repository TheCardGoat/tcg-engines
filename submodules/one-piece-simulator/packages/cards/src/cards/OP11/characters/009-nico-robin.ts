import type { CharacterCard } from "@tcg/op-types";
import { op11NicoRobin009I18n } from "./009-nico-robin.i18n.ts";

export const op11NicoRobin009: CharacterCard = {
  id: "OP11-009",
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "OP11",
  cost: 3,
  power: 4000,
  counter: 1000,
  traits: ["Straw Hat Crew"],
  attribute: "strike",
  effect:
    "[DON!! x2] [When Attacking] Give up to 1 of your opponent's Characters 2000 power until the end of your opponent's next turn.",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
        conditions: [
          {
            condition: "donAttached",
            amount: 2,
          },
        ],
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
            duration: "untilEndOfOpponentNextTurn",
          },
        ],
      },
    ],
  },
  i18n: op11NicoRobin009I18n,
};
