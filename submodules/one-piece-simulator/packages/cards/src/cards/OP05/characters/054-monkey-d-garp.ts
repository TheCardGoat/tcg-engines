import type { CharacterCard } from "@tcg/op-types";
import { op05MonkeyDGarp054I18n } from "./054-monkey-d-garp.i18n.ts";

export const op05MonkeyDGarp054: CharacterCard = {
  id: "OP05-054",
  cardType: "character",
  color: ["blue"],
  rarity: "UC",
  setId: "OP05",
  cost: 3,
  power: 3000,
  counter: 2000,
  traits: ["Navy"],
  attribute: "strike",
  effect:
    "[On Play] Draw 2 cards and place 2 cards from your hand at the bottom of your deck in any order.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 2,
          },
          {
            action: "returnToDeck",
            target: {
              player: "self",
              zones: ["hand"],
              count: {
                amount: 2,
              },
            },
            position: "bottom",
          },
        ],
      },
    ],
  },
  i18n: op05MonkeyDGarp054I18n,
};
