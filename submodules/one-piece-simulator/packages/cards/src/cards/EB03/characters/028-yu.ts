import type { CharacterCard } from "@tcg/op-types";
import { eb03Yu028I18n } from "./028-yu.i18n.ts";

export const eb03Yu028: CharacterCard = {
  id: "EB03-028",
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "EB03",
  cost: 2,
  power: 0,
  counter: 1000,
  traits: ["East Blue"],
  attribute: "wisdom",
  effect:
    "[On Play] Trash 1 card from your hand. [Activate: Main] You may trash this Character: If you have 4 or less cards in your hand, draw 2 cards.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "trashFromHand",
            player: "self",
            amount: 1,
          },
        ],
      },
      {
        trigger: "activateMain",
        conditions: [
          {
            condition: "handCount",
            player: "self",
            comparison: "lte",
            value: 4,
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
            amount: 2,
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: eb03Yu028I18n,
};
