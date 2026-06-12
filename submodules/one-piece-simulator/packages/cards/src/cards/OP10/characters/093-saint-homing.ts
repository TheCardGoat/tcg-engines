import type { CharacterCard } from "@tcg/op-types";
import { op10SaintHoming093I18n } from "./093-saint-homing.i18n.ts";

export const op10SaintHoming093: CharacterCard = {
  id: "OP10-093",
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "OP10",
  cost: 1,
  power: 0,
  counter: 1000,
  traits: ["Celestial Dragons"],
  attribute: "wisdom",
  effect:
    "[Activate: Main] You may trash this Character: Up to 1 of your black Characters gains +3 cost until the end of your opponent's next turn.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "trashThisCard",
          },
        ],
        actions: [
          {
            action: "modifyCost",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "color",
                  value: "black",
                },
              ],
            },
            value: 3,
            duration: "untilEndOfOpponentNextTurn",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op10SaintHoming093I18n,
};
