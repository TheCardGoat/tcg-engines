import type { CharacterCard } from "@tcg/op-types";
import { op05TohToh009I18n } from "./009-toh-toh.i18n.ts";

export const op05TohToh009: CharacterCard = {
  id: "OP05-009",
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "OP05",
  cost: 1,
  power: 0,
  counter: 2000,
  traits: ["Alabasta"],
  attribute: "wisdom",
  effect: "[On Play] Draw 1 card if your Leader has 0 power or less.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
            condition: {
              condition: "cardState",
              target: "this",
              property: "power",
              comparison: "lte",
              value: 0,
            },
          },
        ],
      },
    ],
  },
  i18n: op05TohToh009I18n,
};
