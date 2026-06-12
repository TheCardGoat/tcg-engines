import type { CharacterCard } from "@tcg/op-types";
import { op14eb04Ryuma089I18n } from "./089-ryuma.i18n.ts";

export const op14eb04Ryuma089: CharacterCard = {
  id: "OP14-089",
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "OP14EB04",
  cost: 3,
  power: 5000,
  trigger:
    "Play up to 1 {Thriller Bark Pirates} type Character card with a cost of 4 or less from your trash rested.",
  traits: ["Land of Wano Thriller Bark Pirates"],
  attribute: "slash",
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
  i18n: op14eb04Ryuma089I18n,
};
