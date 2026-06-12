import type { CharacterCard } from "@tcg/op-types";
import { op14eb04Shakuyaku107I18n } from "./107-shakuyaku.i18n.ts";

export const op14eb04Shakuyaku107: CharacterCard = {
  id: "OP14-107",
  cardType: "character",
  color: ["yellow"],
  rarity: "UC",
  setId: "OP14EB04",
  cost: 6,
  power: 5000,
  counter: 2000,
  trigger: "If your Leader has the {Kuja Pirates} type, play this card.",
  traits: ["Amazon Lily"],
  attribute: "wisdom",
  effect:
    "[On Play] If your opponent has 3 or less Life cards, draw 2 cards and trash 2 cards from your hand.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "lifeCount",
            player: "opponent",
            comparison: "lte",
            value: 3,
          },
        ],
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
  i18n: op14eb04Shakuyaku107I18n,
};
