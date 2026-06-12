import type { CharacterCard } from "@tcg/op-types";
import { op04Chinjao086I18n } from "./086-chinjao.i18n.ts";

export const op04Chinjao086: CharacterCard = {
  id: "OP04-086",
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "OP04",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["Happosui Army Dressrosa"],
  attribute: "strike",
  effect:
    "[DON!! x1] When this Character battles and K.O.'s your opponent's Character, draw 2 cards and trash 2 cards from your hand.",
  effects: {
    effects: [
      {
        trigger: "whenCharacterKod",
        conditions: [
          {
            condition: "donAttached",
            amount: 1,
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
  i18n: op04Chinjao086I18n,
};
