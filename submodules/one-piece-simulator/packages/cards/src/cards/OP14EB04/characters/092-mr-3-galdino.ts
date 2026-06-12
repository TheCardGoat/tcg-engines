import type { CharacterCard } from "@tcg/op-types";
import { op14eb04Mr3Galdino092I18n } from "./092-mr-3-galdino.i18n.ts";

export const op14eb04Mr3Galdino092: CharacterCard = {
  id: "OP14-092",
  cardType: "character",
  color: ["black"],
  rarity: "R",
  setId: "OP14EB04",
  cost: 4,
  power: 6000,
  traits: ["Baroque Works"],
  attribute: "special",
  effect:
    "[Opponent's Turn] [Once Per Turn] If this Character would be K.O.'d, you may place 3 cards from your trash at the bottom of your deck in any order instead.",
  effects: {
    replacementEffects: [
      {
        replacedEvent: "ko",
        replacementAction: {
          action: "returnToDeck",
          target: {
            player: "self",
            zones: ["trash"],
            count: {
              amount: 3,
            },
          },
          position: "bottom",
        },
        conditions: [
          {
            condition: "turn",
            value: "opponent",
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: op14eb04Mr3Galdino092I18n,
};
