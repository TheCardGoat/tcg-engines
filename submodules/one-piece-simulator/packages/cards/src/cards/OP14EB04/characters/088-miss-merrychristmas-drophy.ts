import type { CharacterCard } from "@tcg/op-types";
import { op14eb04MissMerrychristmasDrophy088I18n } from "./088-miss-merrychristmas-drophy.i18n.ts";

export const op14eb04MissMerrychristmasDrophy088: CharacterCard = {
  id: "OP14-088",
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "OP14EB04",
  cost: 1,
  power: 2000,
  counter: 2000,
  traits: ["Baroque Works"],
  attribute: "slash",
  effect:
    "[On K.O.] If your Leader's type includes \"Baroque Works\", draw 1 card and K.O. up to 1 of your opponent's Stages with a cost of 1.",
  effects: {
    effects: [
      {
        trigger: "onKo",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Baroque Works",
          },
        ],
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
          {
            action: "ko",
            target: {
              player: "opponent",
              zones: ["stage"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "cost",
                  comparison: "eq",
                  value: 1,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op14eb04MissMerrychristmasDrophy088I18n,
};
