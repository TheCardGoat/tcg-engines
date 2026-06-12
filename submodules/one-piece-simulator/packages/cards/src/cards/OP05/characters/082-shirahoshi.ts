import type { CharacterCard } from "@tcg/op-types";
import { op05Shirahoshi082I18n } from "./082-shirahoshi.i18n.ts";

export const op05Shirahoshi082: CharacterCard = {
  id: "OP05-082",
  cardType: "character",
  color: ["black"],
  rarity: "R",
  setId: "OP05",
  cost: 1,
  power: 0,
  counter: 2000,
  traits: ["Merfolk"],
  attribute: "wisdom",
  effect:
    "[Activate:Main] You may rest this Character and place 2 cards from your trash at the bottom of your deck in any order: If your opponent has 6 or more cards in their hand, your opponent trashes 1 card from their hand.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        conditions: [
          {
            condition: "handCount",
            player: "opponent",
            comparison: "gte",
            value: 6,
          },
        ],
        costs: [
          {
            cost: "restThisCard",
          },
        ],
        actions: [
          {
            action: "trashFromHand",
            player: "opponent",
            amount: 1,
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op05Shirahoshi082I18n,
};
