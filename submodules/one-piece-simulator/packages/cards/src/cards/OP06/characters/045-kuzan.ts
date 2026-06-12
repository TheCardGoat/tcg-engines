import type { CharacterCard } from "@tcg/op-types";
import { op06Kuzan045I18n } from "./045-kuzan.i18n.ts";

export const op06Kuzan045: CharacterCard = {
  id: "OP06-045",
  cardType: "character",
  color: ["blue"],
  rarity: "UC",
  setId: "OP06",
  cost: 3,
  power: 5000,
  traits: ["Navy"],
  attribute: "special",
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
  i18n: op06Kuzan045I18n,
};
