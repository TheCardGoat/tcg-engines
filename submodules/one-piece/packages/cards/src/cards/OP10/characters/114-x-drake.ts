import type { CharacterCard } from "@tcg/op-types";
import { op10XDrake114I18n } from "./114-x-drake.i18n.ts";

export const op10XDrake114: CharacterCard = {
  id: "OP10-114",
  canonicalId: "OP10-114",
  slug: "x-drake/op10-114",
  name: "X.Drake",
  printings: [
    {
      id: "OP10-114",
      artId: "OP10-114",
      setCode: "OP10",
      collectorNumber: "114",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP10-114.jpg",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "UC",
  setId: "OP10",
  cost: 3,
  power: 3000,
  counter: 2000,
  traits: ["Drake Pirates Navy Supernovas"],
  attribute: "slash",
  effect:
    "[Activate: Main] You may rest this Character: If the number of your Life cards is equal to or less than the number of your opponent's Life cards, rest up to 1 of your opponent's Characters with a cost of 4 or less.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "restThisCard",
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
            condition: {
              condition: "lifeComparison",
              selfComparison: "lte",
            },
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op10XDrake114I18n,
};
