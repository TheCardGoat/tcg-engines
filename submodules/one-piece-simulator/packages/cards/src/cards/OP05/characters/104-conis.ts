import type { CharacterCard } from "@tcg/op-types";
import { op05Conis104I18n } from "./104-conis.i18n.ts";

export const op05Conis104: CharacterCard = {
  id: "OP05-104",
  cardType: "character",
  color: ["yellow"],
  rarity: "UC",
  setId: "OP05",
  cost: 1,
  power: 0,
  counter: 2000,
  traits: ["Sky Island"],
  attribute: "wisdom",
  effect:
    "[On Play] You may place 1 of your Stages at the bottom of your deck: Draw 1 card and trash 1 card from your hand.",
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
          {
            action: "trashFromHand",
            player: "self",
            amount: 1,
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op05Conis104I18n,
};
