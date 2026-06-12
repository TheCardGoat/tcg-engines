import type { CharacterCard } from "@tcg/op-types";
import { op11Hatchan034I18n } from "./034-hatchan.i18n.ts";

export const op11Hatchan034: CharacterCard = {
  id: "OP11-034",
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "OP11",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Fish-Man Former Arlong Pirates Fish-Man Island"],
  attribute: "slash",
  effect:
    '[Activate: Main] You may rest this Character: If your Leader has the "Fish-Man" or "Merfolk" type, up to 1 of your opponent\'s Characters with a cost of 3 or less cannot be rested until the end of your opponent\'s next turn.',
  effects: {
    effects: [
      {
        trigger: "activateMain",
        conditions: [
          {
            condition: "compound",
            operator: "or",
            conditions: [
              {
                condition: "leaderTrait",
                trait: "Fish-Man",
              },
              {
                condition: "leaderTrait",
                trait: "Merfolk",
              },
            ],
          },
        ],
        costs: [
          {
            cost: "restThisCard",
          },
        ],
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
                  value: 3,
                },
              ],
            },
            duration: "untilEndOfOpponentNextTurn",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op11Hatchan034I18n,
};
