import type { CharacterCard } from "@tcg/op-types";
import { op03Vergo079I18n } from "./079-vergo.i18n.ts";

export const op03Vergo079: CharacterCard = {
  id: "OP03-079",
  cardType: "character",
  color: ["black"],
  rarity: "UC",
  setId: "OP03",
  cost: 5,
  power: 5000,
  counter: 2000,
  traits: ["Donquixote Pirates Navy"],
  attribute: "strike",
  effect: "[DON!! x1] This Character cannot be K.O.'d in battle.",
  effects: {
    permanentEffects: [
      {
        conditions: [
          {
            condition: "donAttached",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "cannotBeKod",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            duration: "permanent",
            restriction: "inBattle",
          },
        ],
      },
    ],
  },
  i18n: op03Vergo079I18n,
};
