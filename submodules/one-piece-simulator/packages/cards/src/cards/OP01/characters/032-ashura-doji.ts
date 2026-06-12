import type { CharacterCard } from "@tcg/op-types";
import { op01AshuraDoji032I18n } from "./032-ashura-doji.i18n.ts";

export const op01AshuraDoji032: CharacterCard = {
  id: "OP01-032",
  cardType: "character",
  color: ["green"],
  rarity: "UC",
  setId: "OP01",
  cost: 3,
  power: 4000,
  counter: 1000,
  traits: ["Land of Wano The Akazaya Nine"],
  attribute: "slash",
  effect:
    "[DON!! x1] If your opponent has 2 or more rested Characters, this Character gains +2000 power.",
  effects: {
    permanentEffects: [
      {
        conditions: [
          {
            condition: "donAttached",
            amount: 1,
          },
          {
            condition: "zoneCount",
            player: "opponent",
            zone: "character",
            comparison: "gte",
            value: 2,
            filters: [
              {
                filter: "state",
                value: "rested",
              },
            ],
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
  i18n: op01AshuraDoji032I18n,
};
