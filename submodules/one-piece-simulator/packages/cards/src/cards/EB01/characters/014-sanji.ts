import type { CharacterCard } from "@tcg/op-types";
import { eb01Sanji014I18n } from "./014-sanji.i18n.ts";

export const eb01Sanji014: CharacterCard = {
  id: "EB01-014",
  cardType: "character",
  color: ["green"],
  rarity: "R",
  setId: "EB01",
  cost: 4,
  power: 5000,
  counter: 2000,
  traits: ["FILM Straw Hat Crew"],
  attribute: "strike",
  effect:
    "[DON!! x1] [Your Turn] This Character gains +1000 power for every 3 of your rested DON!! cards.",
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
            value: 1000,
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: eb01Sanji014I18n,
};
