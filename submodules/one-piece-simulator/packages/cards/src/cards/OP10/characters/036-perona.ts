import type { CharacterCard } from "@tcg/op-types";
import { op10Perona036I18n } from "./036-perona.i18n.ts";

export const op10Perona036: CharacterCard = {
  id: "OP10-036",
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "OP10",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Thriller Bark Pirates ODYSSEY Muggy Kingdom"],
  attribute: "special",
  effect:
    "[Your Turn] [Once Per Turn] If a Character is rested by your effect, set up to 1 of your DON!! cards as active.",
  effects: {
    effects: [
      {
        trigger: "whenCharacterRestedByEffect",
        conditions: [
          {
            condition: "turn",
            value: "your",
          },
        ],
        actions: [
          {
            action: "setActive",
            target: {
              player: "self",
              zones: ["costArea"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: op10Perona036I18n,
};
