import type { CharacterCard } from "@tcg/op-types";
import { op03Shirahoshi116I18n } from "./116-shirahoshi.i18n.ts";

export const op03Shirahoshi116: CharacterCard = {
  id: "OP03-116",
  cardType: "character",
  color: ["yellow"],
  rarity: "UC",
  setId: "OP03",
  cost: 5,
  power: 0,
  counter: 1000,
  traits: ["Merfolk"],
  attribute: "wisdom",
  effect: "[On Play] Draw 3 cards and trash 2 cards from your hand. [Trigger] Play this card.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 3,
          },
          {
            action: "trashFromHand",
            player: "self",
            amount: 2,
          },
        ],
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "play",
            source: {
              player: "self",
              zone: "hand",
            },
            count: {
              amount: 1,
            },
          },
        ],
      },
    ],
  },
  i18n: op03Shirahoshi116I18n,
};
