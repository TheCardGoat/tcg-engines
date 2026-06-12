import type { CharacterCard } from "@tcg/op-types";
import { op02Helmeppo113I18n } from "./113-helmeppo.i18n.ts";

export const op02Helmeppo113: CharacterCard = {
  id: "OP02-113",
  cardType: "character",
  color: ["black"],
  rarity: "UC",
  setId: "OP02",
  cost: 3,
  power: 3000,
  counter: 1000,
  traits: ["Navy"],
  attribute: "slash",
  effect:
    "[When Attacking] Give up to 1 of your opponent's Characters -2 cost during this turn. Then, if there is a Character with a cost of 0, this Character gains +2000 power during this battle. [Trigger] Play this card.",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
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
      {
        trigger: "trigger",
        actions: [
          {
            action: "play",
            source: {
              player: "self",
              zone: "hand",
            },
            count: {
              amount: 1,
            },
          },
        ],
      },
    ],
  },
  i18n: op02Helmeppo113I18n,
};
