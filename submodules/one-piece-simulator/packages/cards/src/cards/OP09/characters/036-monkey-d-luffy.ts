import type { CharacterCard } from "@tcg/op-types";
import { op09MonkeyDLuffy036I18n } from "./036-monkey-d-luffy.i18n.ts";

export const op09MonkeyDLuffy036: CharacterCard = {
  id: "OP09-036",
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "OP09",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["Straw Hat Crew Supernovas ODYSSEY"],
  attribute: "strike",
  effect:
    "[On Play] If you have 2 or more rested Characters, rest up to 1 of your opponent's DON!! cards or Characters with a cost of 6 or less.",
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
            action: "choice",
            options: [
              [
                {
                  action: "rest",
                  target: {
                    player: "opponent",
                    zones: ["costArea"],
                    count: {
                      amount: 1,
                      upTo: true,
                    },
                  },
                },
              ],
              [
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
                        value: 6,
                      },
                    ],
                  },
                },
              ],
            ],
          },
        ],
      },
    ],
  },
  i18n: op09MonkeyDLuffy036I18n,
};
