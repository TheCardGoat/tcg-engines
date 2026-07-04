import type { CharacterCard } from "@tcg/op-types";
import { op05Shirahoshi082I18n } from "./082-shirahoshi.i18n.ts";

export const op05Shirahoshi082: CharacterCard = {
  id: "OP05-082",
  canonicalId: "OP05-082",
  slug: "shirahoshi/op05-082",
  name: "Shirahoshi",
  printings: [
    {
      id: "OP05-082",
      artId: "OP05-082",
      setCode: "OP05",
      collectorNumber: "082",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-082.jpg",
    },
  ],
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
