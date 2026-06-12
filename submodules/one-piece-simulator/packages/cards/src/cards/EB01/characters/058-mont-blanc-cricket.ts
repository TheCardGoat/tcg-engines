import type { CharacterCard } from "@tcg/op-types";
import { eb01MontBlancCricket058I18n } from "./058-mont-blanc-cricket.i18n.ts";

export const eb01MontBlancCricket058: CharacterCard = {
  id: "EB01-058",
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "EB01",
  cost: 2,
  power: 3000,
  counter: 1000,
  traits: ["Monkey Mountain Alliance"],
  attribute: "strike",
  effect:
    "[DON!! x1] [Your Turn] If you have 2 or less Life cards, this Character gains +2000 power.",
  effects: {
    permanentEffects: [
      {
        conditions: [
          {
            condition: "donAttached",
            amount: 1,
          },
          {
            condition: "turn",
            value: "your",
          },
          {
            condition: "lifeCount",
            player: "self",
            comparison: "lte",
            value: 2,
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
            value: 2000,
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: eb01MontBlancCricket058I18n,
};
