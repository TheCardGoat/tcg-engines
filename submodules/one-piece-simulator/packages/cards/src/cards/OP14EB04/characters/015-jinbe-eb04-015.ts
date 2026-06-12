import type { CharacterCard } from "@tcg/op-types";
import { op14eb04JinbeEb04015015I18n } from "./015-jinbe-eb04-015.i18n.ts";

export const op14eb04JinbeEb04015015: CharacterCard = {
  id: "EB04-015",
  cardType: "character",
  color: ["green"],
  rarity: "R",
  setId: "OP14EB04",
  cost: 7,
  power: 8000,
  traits: ["Fish-Man The Sun Pirates Fish-Man Island"],
  attribute: "strike",
  effect:
    "[Blocker]\n[On K.O.] You may rest 1 of your cards: If your Leader has the {Fish-Man} or {Merfolk} type, play up to 1 green Character card with a cost of 6 or less from your hand.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onKo",
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
            cost: "restCards",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "play",
            source: {
              player: "self",
              zone: "hand",
            },
            count: {
              amount: 1,
              upTo: true,
            },
            filters: [
              {
                filter: "cost",
                comparison: "lte",
                value: 6,
              },
              {
                filter: "color",
                value: "green",
              },
              {
                filter: "cardCategory",
                value: "character",
              },
            ],
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op14eb04JinbeEb04015015I18n,
};
