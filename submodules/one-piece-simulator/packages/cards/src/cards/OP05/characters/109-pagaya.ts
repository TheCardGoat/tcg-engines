import type { CharacterCard } from "@tcg/op-types";
import { op05Pagaya109I18n } from "./109-pagaya.i18n.ts";

export const op05Pagaya109: CharacterCard = {
  id: "OP05-109",
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "OP05",
  cost: 1,
  power: 1000,
  counter: 1000,
  traits: ["Sky Island"],
  attribute: "wisdom",
  effect:
    "[Once Per Turn] When a [Trigger] activates, draw 2 cards and trash 2 cards from your hand.",
  effects: {
    effects: [
      {
        trigger: "whenTriggerActivates",
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
        oncePerTurn: true,
      },
    ],
  },
  i18n: op05Pagaya109I18n,
};
