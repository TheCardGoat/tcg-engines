import type { CharacterCard } from "@tcg/op-types";
import { op06Brook092I18n } from "./092-brook.i18n.ts";

export const op06Brook092: CharacterCard = {
  id: "OP06-092",
  cardType: "character",
  color: ["black"],
  rarity: "R",
  setId: "OP06",
  cost: 6,
  power: 6000,
  traits: ["Former Rumbar Pirates"],
  attribute: "slash",
  effect:
    "[On Play] Choose one:\n• Trash up to 1 of your opponent's Characters with a cost of 4 or less.\n• Your opponent places 3 cards from their trash at bottom of their deck in any order.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "choice",
            options: [
              [
                {
                  action: "trashFromField",
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
            ],
          },
        ],
      },
    ],
  },
  i18n: op06Brook092I18n,
};
