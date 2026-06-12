import type { CharacterCard } from "@tcg/op-types";
import { op03Patty049I18n } from "./049-patty.i18n.ts";

export const op03Patty049: CharacterCard = {
  id: "OP03-049",
  cardType: "character",
  color: ["blue"],
  rarity: "UC",
  setId: "OP03",
  cost: 3,
  power: 5000,
  traits: ["East Blue"],
  attribute: "slash",
  effect:
    "[On Play] If you have 20 or less cards in your deck, return up to 1 Character with a cost of 3 or less to the owner's hand.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "zoneCount",
            player: "self",
            zone: "deck",
            comparison: "lte",
            value: 20,
          },
        ],
        actions: [
          {
            action: "returnToHand",
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
                  value: 3,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op03Patty049I18n,
};
