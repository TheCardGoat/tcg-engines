import type { CharacterCard } from "@tcg/op-types";
import { op03CharlotteSmoothie110I18n } from "./110-charlotte-smoothie.i18n.ts";

export const op03CharlotteSmoothie110: CharacterCard = {
  id: "OP03-110",
  cardType: "character",
  color: ["yellow"],
  rarity: "R",
  setId: "OP03",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Big Mom Pirates"],
  attribute: "special",
  effect:
    "[When Attacking] You may add 1 card from the top or bottom of your Life cards to your hand: This Character gains +2000 power during this battle.",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
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
            value: 2000,
            duration: "thisBattle",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op03CharlotteSmoothie110I18n,
};
