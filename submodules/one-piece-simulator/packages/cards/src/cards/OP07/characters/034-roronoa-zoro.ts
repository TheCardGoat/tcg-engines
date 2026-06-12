import type { CharacterCard } from "@tcg/op-types";
import { op07RoronoaZoro034I18n } from "./034-roronoa-zoro.i18n.ts";

export const op07RoronoaZoro034: CharacterCard = {
  id: "OP07-034",
  cardType: "character",
  color: ["green"],
  rarity: "UC",
  setId: "OP07",
  cost: 1,
  power: 2000,
  counter: 1000,
  traits: ["Straw Hat Crew Supernovas"],
  attribute: "slash",
  effect:
    "[When Attacking] If you have 3 or more Characters, this Character gains +2000 power during this turn.",
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
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: op07RoronoaZoro034I18n,
};
