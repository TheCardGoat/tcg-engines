import type { CharacterCard } from "@tcg/op-types";
import { op01Bartolomeo019I18n } from "./019-bartolomeo.i18n.ts";

export const op01Bartolomeo019: CharacterCard = {
  id: "OP01-019",
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "OP01",
  cost: 2,
  power: 2000,
  counter: 1000,
  traits: ["Barto Club Pirates Supernovas"],
  attribute: "special",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.) [DON!! x2] [Opponent's Turn] This Character gains +3000 power.",
  effects: {
    keywords: ["blocker"],
    permanentEffects: [
      {
        conditions: [
          {
            condition: "donAttached",
            amount: 2,
          },
          {
            condition: "turn",
            value: "opponent",
          },
        ],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            value: 3000,
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: op01Bartolomeo019I18n,
};
