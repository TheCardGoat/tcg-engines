import type { CharacterCard } from "@tcg/op-types";
import { op09Pierre110I18n } from "./110-pierre.i18n.ts";

export const op09Pierre110: CharacterCard = {
  id: "OP09-110",
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "OP09",
  cost: 2,
  power: 2000,
  counter: 1000,
  trigger: "Play this card.",
  traits: ["Animal Sky Island"],
  attribute: "strike",
  effect: "[On Play] Draw 2 cards and trash 2 cards from your hand.",
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
            action: "trashFromHand",
            player: "self",
            amount: 2,
          },
        ],
      },
    ],
  },
  i18n: op09Pierre110I18n,
};
