import type { CharacterCard } from "@tcg/op-types";
import { op09Sabo027I18n } from "./027-sabo.i18n.ts";

export const op09Sabo027: CharacterCard = {
  id: "OP09-027",
  cardType: "character",
  color: ["green"],
  rarity: "UC",
  setId: "OP09",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["Revolutionary Army ODYSSEY"],
  attribute: "special",
  effect: "[When Attacking] [Once Per Turn] If you have 3 or more rested Characters, draw 1 card.",
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
            value: 3,
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
  i18n: op09Sabo027I18n,
};
