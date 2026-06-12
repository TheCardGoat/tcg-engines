import type { CharacterCard } from "@tcg/op-types";
import { op10Caribou104I18n } from "./104-caribou.i18n.ts";

export const op10Caribou104: CharacterCard = {
  id: "OP10-104",
  cardType: "character",
  color: ["yellow"],
  rarity: "UC",
  setId: "OP10",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Caribou Pirates Supernovas"],
  attribute: "special",
  effect:
    '[DON!! x1] If your Leader has the "Supernovas" type and your opponent has 3 or more Life cards, this Character cannot be K.O.\'d in battle.',
  effects: {
    permanentEffects: [
      {
        conditions: [
          {
            condition: "donAttached",
            amount: 1,
          },
          {
            condition: "compound",
            operator: "and",
            conditions: [
              {
                condition: "leaderTrait",
                trait: "Supernovas",
              },
              {
                condition: "lifeCount",
                player: "opponent",
                comparison: "gte",
                value: 3,
              },
            ],
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
  i18n: op10Caribou104I18n,
};
