import type { CharacterCard } from "@tcg/op-types";
import { op12VinsmokeSora062I18n } from "./062-vinsmoke-sora.i18n.ts";

export const op12VinsmokeSora062: CharacterCard = {
  id: "OP12-062",
  cardType: "character",
  color: ["purple"],
  rarity: "R",
  setId: "OP12",
  cost: 1,
  power: 0,
  counter: 2000,
  traits: ["The Vinsmoke Family Kingdom of GERMA"],
  attribute: "wisdom",
  effect:
    "[On Play] If your Leader is [Sanji] and the number of DON!! cards on your field is equal to or less than the number on your opponent's field, add up to 1 DON!! card from your DON!! deck and rest it. Then, draw 1 card.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "compound",
            operator: "and",
            conditions: [
              {
                condition: "leaderName",
                name: "Sanji",
              },
              {
                condition: "donFieldComparison",
                selfComparison: "lte",
              },
            ],
          },
        ],
        actions: [
          {
            action: "addDon",
            count: {
              amount: 1,
              upTo: true,
            },
            state: "rested",
          },
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
        ],
      },
    ],
  },
  i18n: op12VinsmokeSora062I18n,
};
