import type { CharacterCard } from "@tcg/op-types";
import { op05Gladius025I18n } from "./025-gladius.i18n.ts";

export const op05Gladius025: CharacterCard = {
  id: "OP05-025",
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "OP05",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["Donquixote Pirates"],
  attribute: "special",
  effect:
    "[Activate:Main] You may rest this Character: Rest up to 1 of your opponent's Characters with a cost of 3 or less.",
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
  i18n: op05Gladius025I18n,
};
