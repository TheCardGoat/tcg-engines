import type { CharacterCard } from "@tcg/op-types";
import { op13NicoRobin032I18n } from "./032-nico-robin.i18n.ts";

export const op13NicoRobin032: CharacterCard = {
  id: "OP13-032",
  cardType: "character",
  color: ["green"],
  rarity: "UC",
  setId: "OP13",
  cost: 7,
  power: 7000,
  counter: 1000,
  traits: ["FILM Straw Hat Crew"],
  attribute: "strike",
  effect:
    "[On Play] Up to 1 of your opponent's Characters with a cost of 8 or less cannot be rested until the end of your opponent's next End Phase.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "cannotBeRested",
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
                  value: 8,
                },
              ],
            },
            duration: "untilEndOfOpponentNextTurn",
          },
        ],
      },
    ],
  },
  i18n: op13NicoRobin032I18n,
};
