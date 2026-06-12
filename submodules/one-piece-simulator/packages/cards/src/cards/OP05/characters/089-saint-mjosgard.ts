import type { CharacterCard } from "@tcg/op-types";
import { op05SaintMjosgard089I18n } from "./089-saint-mjosgard.i18n.ts";

export const op05SaintMjosgard089: CharacterCard = {
  id: "OP05-089",
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "OP05",
  cost: 5,
  power: 1000,
  counter: 1000,
  traits: ["Celestial Dragons"],
  attribute: "wisdom",
  effect:
    "[Activate:Main] (1) (You may rest the specified number of DON!! cards in your cost area.) You may rest this Character and 1 of your Characters: Add up to 1 black Character card with a cost of 1 from your trash to your hand.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "restDon",
            amount: 1,
          },
          {
            cost: "restThisCard",
          },
        ],
        actions: [
          {
            action: "returnToHand",
            target: {
              player: "self",
              zones: ["trash"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "color",
                  value: "black",
                },
                {
                  filter: "cardCategory",
                  value: "character",
                },
                {
                  filter: "cost",
                  comparison: "eq",
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
  i18n: op05SaintMjosgard089I18n,
};
