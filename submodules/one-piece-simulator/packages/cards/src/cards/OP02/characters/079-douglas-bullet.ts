import type { CharacterCard } from "@tcg/op-types";
import { op02DouglasBullet079I18n } from "./079-douglas-bullet.i18n.ts";

export const op02DouglasBullet079: CharacterCard = {
  id: "OP02-079",
  cardType: "character",
  color: ["purple"],
  rarity: "UC",
  setId: "OP02",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["FILM The Pirates Fest"],
  attribute: "special",
  effect:
    "[On Play] DON!! -1 (You may return the specified number of DON!! cards from your field to your DON!! deck.): Rest up to 1 of your opponent's Characters with a cost of 4 or less.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "returnDon",
            amount: 1,
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
                  value: 4,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op02DouglasBullet079I18n,
};
