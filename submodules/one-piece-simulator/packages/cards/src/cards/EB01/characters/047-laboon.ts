import type { CharacterCard } from "@tcg/op-types";
import { eb01Laboon047I18n } from "./047-laboon.i18n.ts";

export const eb01Laboon047: CharacterCard = {
  id: "EB01-047",
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "EB01",
  cost: 2,
  power: 4000,
  traits: ["Animal"],
  attribute: "strike",
  effect:
    "[Once Per Turn] When a Character is K.O.'d, draw 1 card and trash 1 card from your hand.",
  effects: {
    effects: [
      {
        trigger: "whenCharacterKod",
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
        oncePerTurn: true,
      },
    ],
  },
  i18n: eb01Laboon047I18n,
};
