import type { CharacterCard } from "@tcg/op-types";
import { op09PortgasDAce035I18n } from "./035-portgas-d-ace.i18n.ts";

export const op09PortgasDAce035: CharacterCard = {
  id: "OP09-035",
  cardType: "character",
  color: ["green"],
  rarity: "UC",
  setId: "OP09",
  cost: 5,
  power: 5000,
  counter: 2000,
  traits: ["Whitebeard Pirates ODYSSEY"],
  attribute: "special",
  effect:
    "[On Play] If you have 2 or more rested Characters, rest up to 1 of your opponent's Characters with a cost of 5 or less.",
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
            action: "rest",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
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
  i18n: op09PortgasDAce035I18n,
};
