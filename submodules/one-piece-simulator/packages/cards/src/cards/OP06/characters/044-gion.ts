import type { CharacterCard } from "@tcg/op-types";
import { op06Gion044I18n } from "./044-gion.i18n.ts";

export const op06Gion044: CharacterCard = {
  id: "OP06-044",
  cardType: "character",
  color: ["blue"],
  rarity: "UC",
  setId: "OP06",
  cost: 4,
  power: 5000,
  counter: 2000,
  traits: ["Navy"],
  attribute: "slash",
  effect:
    "[Your Turn][Once Per Turn] When your opponent activates an Event, your opponent must place 1 card from their hand at the bottom of their deck.",
  effects: {
    effects: [
      {
        trigger: "whenOpponentActivatesEvent",
        conditions: [
          {
            condition: "turn",
            value: "your",
          },
        ],
        actions: [
          {
            action: "returnToDeck",
            target: {
              player: "opponent",
              zones: ["hand"],
              count: {
                amount: 1,
              },
            },
            position: "bottom",
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: op06Gion044I18n,
};
