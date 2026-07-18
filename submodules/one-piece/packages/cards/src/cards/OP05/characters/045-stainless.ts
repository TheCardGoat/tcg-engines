import type { CharacterCard } from "@tcg/op-types";
import { op05Stainless045I18n } from "./045-stainless.i18n.ts";

export const op05Stainless045: CharacterCard = {
  id: "OP05-045",
  canonicalId: "OP05-045",
  slug: "stainless",
  name: "Stainless",
  printings: [
    {
      id: "OP05-045",
      artId: "OP05-045",
      setCode: "OP05",
      collectorNumber: "045",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-045.jpg",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "OP05",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Navy"],
  attribute: "slash",
  effect:
    "[Activate:Main] You may trash 1 card from your hand and rest this Character: Place up to 1 Character with a cost of 2 or less at the bottom of the owner's deck.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
          },
          {
            cost: "restThisCard",
          },
        ],
        actions: [
          {
            action: "returnToDeck",
            target: {
              player: "any",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 2,
                },
              ],
            },
            position: "bottom",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op05Stainless045I18n,
};
