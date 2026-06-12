import type { CharacterCard } from "@tcg/op-types";
import { op08Nekomamushi028I18n } from "./028-nekomamushi.i18n.ts";

export const op08Nekomamushi028: CharacterCard = {
  id: "OP08-028",
  cardType: "character",
  color: ["green"],
  rarity: "UC",
  setId: "OP08",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["Minks The Akazaya Nine"],
  attribute: "slash",
  effect:
    "[On Play] If your opponent has 7 or more rested cards, this Character gains [Rush] during this turn. (This card can attack on the turn in which it is played.)",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "zoneCount",
            player: "opponent",
            zone: "field",
            comparison: "gte",
            value: 7,
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
            action: "grantKeyword",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            keyword: "rush",
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: op08Nekomamushi028I18n,
};
