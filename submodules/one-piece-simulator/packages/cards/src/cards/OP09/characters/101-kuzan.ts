import type { CharacterCard } from "@tcg/op-types";
import { op09Kuzan101I18n } from "./101-kuzan.i18n.ts";

export const op09Kuzan101: CharacterCard = {
  id: "OP09-101",
  cardType: "character",
  color: ["yellow"],
  rarity: "R",
  setId: "OP09",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Navy"],
  attribute: "special",
  effect:
    "[On Play] Place 1 of your opponent's Characters with a cost of 3 or less at the top or bottom of your opponent's Life cards face-up: Your opponent trashes 1 card from their hand.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "addToLife",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
              },
              filters: [
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 3,
                },
              ],
            },
            position: "top",
            faceUp: true,
          },
          {
            action: "trashFromHand",
            player: "opponent",
            amount: 1,
          },
        ],
      },
    ],
  },
  i18n: op09Kuzan101I18n,
};
