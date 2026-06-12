import type { CharacterCard } from "@tcg/op-types";
import { op10Foxy075I18n } from "./075-foxy.i18n.ts";

export const op10Foxy075: CharacterCard = {
  id: "OP10-075",
  cardType: "character",
  color: ["purple"],
  rarity: "UC",
  setId: "OP10",
  cost: 2,
  power: 1000,
  counter: 2000,
  traits: ["Foxy Pirates"],
  attribute: "special",
  effect:
    "[Activate: Main] You may trash this Character: If the number of DON!! cards on your field is equal to or less than the number on your opponent's field, draw 1 card.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        conditions: [
          {
            condition: "donFieldComparison",
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
        ],
        optional: true,
      },
    ],
  },
  i18n: op10Foxy075I18n,
};
