import type { CharacterCard } from "@tcg/op-types";
import { eb03MissDoublefingerZala046I18n } from "./046-miss-doublefinger-zala.i18n.ts";

export const eb03MissDoublefingerZala046: CharacterCard = {
  id: "EB03-046",
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "EB03",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Baroque Works"],
  attribute: "slash",
  effect:
    "[On Play] If there is a Character with a cost of 0 or with a cost of 8 or more, draw 1 card. [On K.O.] Trash 2 cards from the top of your deck.",
  effects: {
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
            amount: 1,
          },
        ],
      },
      {
        trigger: "onKo",
        actions: [
          {
            action: "trashFromDeck",
            player: "self",
            amount: 2,
          },
        ],
      },
    ],
  },
  i18n: eb03MissDoublefingerZala046I18n,
};
