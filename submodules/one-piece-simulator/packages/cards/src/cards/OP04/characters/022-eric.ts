import type { CharacterCard } from "@tcg/op-types";
import { op04Eric022I18n } from "./022-eric.i18n.ts";

export const op04Eric022: CharacterCard = {
  id: "OP04-022",
  cardType: "character",
  color: ["green"],
  rarity: "UC",
  setId: "OP04",
  cost: 1,
  power: 2000,
  counter: 1000,
  traits: ["East Blue"],
  attribute: "slash",
  effect:
    "[Activate:Main] You may rest this Character: Rest up to 1 of your opponent's Characters with a cost of 1 or less.",
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
                  value: 1,
                },
              ],
            },
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op04Eric022I18n,
};
