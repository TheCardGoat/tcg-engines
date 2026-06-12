import type { CharacterCard } from "@tcg/op-types";
import { op04DaddyMasterson027I18n } from "./027-daddy-masterson.i18n.ts";

export const op04DaddyMasterson027: CharacterCard = {
  id: "OP04-027",
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "OP04",
  cost: 4,
  power: 5000,
  traits: ["Former Navy East Blue"],
  attribute: "ranged",
  effect: "[DON!! x1] [End of Your Turn] Set this Character as active.",
  effects: {
    effects: [
      {
        trigger: "endOfYourTurn",
        conditions: [
          {
            condition: "donAttached",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "setActive",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
          },
        ],
      },
    ],
  },
  i18n: op04DaddyMasterson027I18n,
};
