import type { CharacterCard } from "@tcg/op-types";
import { op14eb04SpiderMice081I18n } from "./081-spider-mice.i18n.ts";

export const op14eb04SpiderMice081: CharacterCard = {
  id: "OP14-081",
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "OP14EB04",
  cost: 1,
  power: 1000,
  counter: 1000,
  traits: ["Thriller Bark Pirates"],
  attribute: "special",
  effect:
    "[On Play] Trash 3 cards from the top of your deck.\n[On K.O.] K.O. up to 1 of your opponent's Characters with a base cost of 1.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "trashFromDeck",
            player: "self",
            amount: 3,
          },
        ],
      },
      {
        trigger: "onKo",
        actions: [
          {
            action: "ko",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "baseCost",
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
  i18n: op14eb04SpiderMice081I18n,
};
