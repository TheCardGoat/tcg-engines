import type { CharacterCard } from "@tcg/op-types";
import { op14eb04MissGoldenweekMarianne085I18n } from "./085-miss-goldenweek-marianne.i18n.ts";

export const op14eb04MissGoldenweekMarianne085: CharacterCard = {
  id: "OP14-085",
  cardType: "character",
  color: ["black"],
  rarity: "UC",
  setId: "OP14EB04",
  cost: 1,
  power: 2000,
  counter: 2000,
  traits: ["Baroque Works"],
  attribute: "wisdom",
  effect: "[On K.O.] Draw 2 cards and trash 2 cards from your hand.",
  effects: {
    effects: [
      {
        trigger: "onKo",
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
  i18n: op14eb04MissGoldenweekMarianne085I18n,
};
