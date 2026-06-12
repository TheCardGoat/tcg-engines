import type { CharacterCard } from "@tcg/op-types";
import { op01Raizo052I18n } from "./052-raizo.i18n.ts";

export const op01Raizo052: CharacterCard = {
  id: "OP01-052",
  cardType: "character",
  color: ["green"],
  rarity: "UC",
  setId: "OP01",
  cost: 3,
  power: 4000,
  counter: 1000,
  traits: ["Land of Wano The Akazaya Nine"],
  attribute: "slash",
  effect: "[When Attacking] [Once Per Turn] If you have 2 or more rested Characters, draw 1 card.",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
        conditions: [
          {
            condition: "zoneCount",
            player: "self",
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
            action: "draw",
            player: "self",
            amount: 1,
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: op01Raizo052I18n,
};
