import type { CharacterCard } from "@tcg/op-types";
import { op10Nami033I18n } from "./033-nami.i18n.ts";

export const op10Nami033: CharacterCard = {
  id: "OP10-033",
  cardType: "character",
  color: ["green"],
  rarity: "UC",
  setId: "OP10",
  cost: 2,
  power: 2000,
  counter: 2000,
  traits: ["Straw Hat Crew ODYSSEY"],
  attribute: "special",
  effect:
    "[On Play] If you have 2 or more rested \"ODYSSEY\" type Characters, up to 1 of your opponent's rested DON!! cards will not become active in your opponent's next Refresh Phase.",
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
              {
                filter: "trait",
                value: "ODYSSEY",
              },
            ],
          },
        ],
        actions: [
          {
            action: "freeze",
            target: {
              player: "opponent",
              zones: ["character", "costArea"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "state",
                  value: "rested",
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op10Nami033I18n,
};
