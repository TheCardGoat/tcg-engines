import type { CharacterCard } from "@tcg/op-types";
import { op05UtaSp120I18n } from "./120-uta-sp.i18n.ts";

export const op05UtaSp120: CharacterCard = {
  id: "OP02-120",
  cardType: "character",
  color: ["purple"],
  rarity: "SEC",
  setId: "OP05",
  cost: 8,
  power: 8000,
  traits: ["FILM"],
  attribute: "special",
  effect:
    "[On Play] DON!! -2 (You may return the specified number of DON!! cards from your field to your DON!! deck.): Your Leader and all of your Characters gain +1000 power until the start of your next turn.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "returnDon",
            amount: 2,
          },
        ],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: {
                amount: "all",
              },
            },
            value: 1000,
            duration: "untilStartOfNextTurn",
          },
        ],
      },
    ],
  },
  i18n: op05UtaSp120I18n,
};
