import type { CharacterCard } from "@tcg/op-types";
import { op13Tom069I18n } from "./069-tom.i18n.ts";

export const op13Tom069: CharacterCard = {
  id: "OP13-069",
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "OP13",
  cost: 2,
  power: 2000,
  counter: 1000,
  traits: ["Fish-Man Water Seven"],
  attribute: "wisdom",
  effect:
    "[On Play] DON!! -1: Add up to 1 Stage card with a cost of 3 or less from your trash to your hand.",
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
            action: "returnToHand",
            target: {
              player: "self",
              zones: ["trash"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "cardCategory",
                  value: "stage",
                },
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
  i18n: op13Tom069I18n,
};
