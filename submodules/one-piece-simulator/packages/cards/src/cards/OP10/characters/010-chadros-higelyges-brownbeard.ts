import type { CharacterCard } from "@tcg/op-types";
import { op10ChadrosHigelygesBrownbeard010I18n } from "./010-chadros-higelyges-brownbeard.i18n.ts";

export const op10ChadrosHigelygesBrownbeard010: CharacterCard = {
  id: "OP10-010",
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "OP10",
  cost: 3,
  power: 5000,
  traits: ["Punk Hazard Brownbeard Pirates"],
  attribute: "slash",
  effect:
    "[When Attacking] If you have 1 or less Characters with 6000 power or more, this Character gains +1000 power during this turn.",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
        conditions: [
          {
            condition: "zoneCount",
            player: "self",
            zone: "character",
            comparison: "lte",
            value: 1,
            filters: [
              {
                filter: "power",
                comparison: "gte",
                value: 6000,
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
            value: 1000,
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: op10ChadrosHigelygesBrownbeard010I18n,
};
