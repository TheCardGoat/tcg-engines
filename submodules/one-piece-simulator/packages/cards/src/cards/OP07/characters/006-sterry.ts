import type { CharacterCard } from "@tcg/op-types";
import { op07Sterry006I18n } from "./006-sterry.i18n.ts";

export const op07Sterry006: CharacterCard = {
  id: "OP07-006",
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "OP07",
  cost: 1,
  power: 1000,
  counter: 1000,
  traits: ["Goa Kingdom"],
  attribute: "wisdom",
  effect:
    "[On Play] You may give your 1 active Leader -5000 power during this turn: Draw 1 card and trash 1 card from your hand.",
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
  i18n: op07Sterry006I18n,
};
