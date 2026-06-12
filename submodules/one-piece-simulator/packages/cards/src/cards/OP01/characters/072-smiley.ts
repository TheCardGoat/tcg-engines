import type { CharacterCard } from "@tcg/op-types";
import { op01Smiley072I18n } from "./072-smiley.i18n.ts";

export const op01Smiley072: CharacterCard = {
  id: "OP01-072",
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "OP01",
  cost: 3,
  power: 1000,
  counter: 1000,
  traits: ["Biological Weapon Punk Hazard"],
  attribute: "special",
  effect: "[DON!! x1] [Your Turn] This Character gains +1000 power for every card in your hand.",
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
  i18n: op01Smiley072I18n,
};
