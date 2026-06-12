import type { CharacterCard } from "@tcg/op-types";
import { op06Inuppe082I18n } from "./082-inuppe.i18n.ts";

export const op06Inuppe082: CharacterCard = {
  id: "OP06-082",
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "OP06",
  cost: 2,
  power: 3000,
  counter: 1000,
  traits: ["Thriller Bark Pirates"],
  attribute: "strike",
  effect:
    "[On Play] / [On K.O.] If your Leader has the [Thriller Bark Pirates] type, draw 2 cards and trash 2 cards from your hand.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Thriller Bark Pirates",
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
      {
        trigger: "onKo",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Thriller Bark Pirates",
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
  i18n: op06Inuppe082I18n,
};
