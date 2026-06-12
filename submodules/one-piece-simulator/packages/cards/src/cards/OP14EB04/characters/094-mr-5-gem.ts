import type { CharacterCard } from "@tcg/op-types";
import { op14eb04Mr5Gem094I18n } from "./094-mr-5-gem.i18n.ts";

export const op14eb04Mr5Gem094: CharacterCard = {
  id: "OP14-094",
  cardType: "character",
  color: ["black"],
  rarity: "UC",
  setId: "OP14EB04",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["Baroque Works"],
  attribute: "strike",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)\n[On Play] If there is a Character with a cost of 0 or with a cost of 8 or more, draw 2 cards and trash 1 card from your hand.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "compound",
            operator: "or",
            conditions: [
              {
                condition: "existsOnField",
                zone: "character",
                filters: [
                  {
                    filter: "cost",
                    comparison: "eq",
                    value: 0,
                  },
                ],
              },
              {
                condition: "existsOnField",
                zone: "character",
                filters: [
                  {
                    filter: "cost",
                    comparison: "gte",
                    value: 8,
                  },
                ],
              },
            ],
          },
        ],
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 2,
          },
          {
            action: "trashFromHand",
            player: "self",
            amount: 1,
          },
        ],
      },
    ],
  },
  i18n: op14eb04Mr5Gem094I18n,
};
