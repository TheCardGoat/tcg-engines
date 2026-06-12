import type { CharacterCard } from "@tcg/op-types";
import { eb01Gastino053I18n } from "./053-gastino.i18n.ts";

export const eb01Gastino053: CharacterCard = {
  id: "EB01-053",
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "EB01",
  cost: 3,
  power: 5000,
  traits: ["Scientist"],
  attribute: "special",
  effect:
    "[On Play] Place up to 1 of your opponent's Characters with a cost of 3 or less at the top or bottom of your opponent's Life cards face-up.[Trigger] Give up to a total of 2 of your opponent's Leader or Character cards -3000 power during this turn.",
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
            position: "top",
            faceUp: true,
          },
        ],
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "opponent",
              zones: ["leader", "character"],
              count: {
                amount: 2,
                upTo: true,
              },
            },
            value: -3000,
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: eb01Gastino053I18n,
};
