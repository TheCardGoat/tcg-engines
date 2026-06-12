import type { CharacterCard } from "@tcg/op-types";
import { op05Buffalo031I18n } from "./031-buffalo.i18n.ts";

export const op05Buffalo031: CharacterCard = {
  id: "OP05-031",
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "OP05",
  cost: 3,
  power: 4000,
  counter: 1000,
  traits: ["Donquixote Pirates"],
  attribute: "strike",
  effect:
    "[When Attacking][Once Per Turn] If you have 2 or more rested Characters, set up to 1 of your rested Characters with a cost of 1 as active.",
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
                  filter: "cost",
                  comparison: "eq",
                  value: 1,
                },
              ],
            },
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: op05Buffalo031I18n,
};
