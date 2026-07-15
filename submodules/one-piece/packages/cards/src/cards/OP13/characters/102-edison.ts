import type { CharacterCard } from "@tcg/op-types";
import { op13Edison102I18n } from "./102-edison.i18n.ts";

export const op13Edison102: CharacterCard = {
  id: "OP13-102",
  canonicalId: "OP13-102",
  slug: "edison/op13-102",
  name: "Edison",
  printings: [
    {
      id: "OP13-102",
      artId: "OP13-102",
      setCode: "OP13",
      collectorNumber: "102",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP13-102_t91X9iE.jpg",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "UC",
  setId: "OP13",
  cost: 3,
  power: 2000,
  counter: 2000,
  trigger: "Draw 1 card and rest up to 1 of your opponent's Characters with a cost of 3 or less.",
  traits: ["Scientist Egghead"],
  attribute: "wisdom",
  effect:
    "[Activate: Main] You may trash this Character: If the number of your Life cards is equal to or less than the number of your opponent's Life cards, draw 1 card. Then, rest up to 1 of your opponent's Characters with a cost of 3 or less.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        conditions: [
          {
            condition: "lifeComparison",
            selfComparison: "lte",
          },
        ],
        costs: [
          {
            cost: "trashThisCard",
          },
        ],
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
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
                  value: 3,
                },
              ],
            },
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op13Edison102I18n,
};
