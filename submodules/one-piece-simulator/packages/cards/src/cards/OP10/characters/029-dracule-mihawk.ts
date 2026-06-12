import type { CharacterCard } from "@tcg/op-types";
import { op10DraculeMihawk029I18n } from "./029-dracule-mihawk.i18n.ts";

export const op10DraculeMihawk029: CharacterCard = {
  id: "OP10-029",
  cardType: "character",
  color: ["green"],
  rarity: "R",
  setId: "OP10",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["The Seven Warlords of the Sea ODYSSEY"],
  attribute: "slash",
  effect:
    '[On Play] If you have 2 or more rested Characters, set up to 1 of your rested "ODYSSEY" type Characters with a cost of 5 or less as active.',
  effects: {
    effects: [
      {
        trigger: "onPlay",
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
            action: "setActive",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "state",
                  value: "rested",
                },
                {
                  filter: "trait",
                  value: "ODYSSEY",
                },
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 5,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op10DraculeMihawk029I18n,
};
