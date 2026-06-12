import type { CharacterCard } from "@tcg/op-types";
import { op01Gordon011I18n } from "./011-gordon.i18n.ts";

export const op01Gordon011: CharacterCard = {
  id: "OP01-011",
  cardType: "character",
  color: ["red"],
  rarity: "UC",
  setId: "OP01",
  cost: 2,
  power: 3000,
  counter: 2000,
  traits: ["Film"],
  attribute: "wisdom",
  effect: "[On Play] You may place 1 card from your hand at the bottom of your deck: Draw 1 card.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op01Gordon011I18n,
};
