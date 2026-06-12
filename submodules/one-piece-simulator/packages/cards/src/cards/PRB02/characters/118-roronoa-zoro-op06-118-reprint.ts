import type { CharacterCard } from "@tcg/op-types";
import { prb02RoronoaZoroOp06118Reprint118I18n } from "./118-roronoa-zoro-op06-118-reprint.i18n.ts";

export const prb02RoronoaZoroOp06118Reprint118: CharacterCard = {
  id: "OP06-118",
  cardType: "character",
  color: ["green"],
  rarity: "SEC",
  setId: "PRB02",
  cost: 9,
  power: 9000,
  traits: ["Straw Hat Crew"],
  attribute: "slash",
  effect:
    '[When Attacking][Once Per Turn](1)(You may rest the specified number of DON!! cards in your cost area.): Set this Character as active.[Activate:Main][Once Per Turn](2)(You may rest the specified number of DON!! cards in your cost area.): Set this Character as active.Disclaimer: This card was reprinted from the original set with changes to the copyright information (Note: the original print did not include "EN" at the end of the copyright).',
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
        costs: [
          {
            cost: "restDon",
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
        oncePerTurn: true,
      },
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "restDon",
            amount: 2,
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
        oncePerTurn: true,
      },
    ],
  },
  i18n: prb02RoronoaZoroOp06118Reprint118I18n,
};
