import type { CharacterCard } from "@tcg/op-types";
import { op09KouzukiOden047I18n } from "./047-kouzuki-oden.i18n.ts";

export const op09KouzukiOden047: CharacterCard = {
  id: "OP09-047",
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "OP09",
  cost: 9,
  power: 10000,
  traits: ["Land of Wano Whitebeard Pirates"],
  attribute: "slash",
  effect:
    "[Double Attack] (This card deals 2 damage.)\n[On K.O.] Draw 2 cards and trash 1 card from your hand.",
  effects: {
    keywords: ["doubleAttack"],
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
            amount: 1,
          },
        ],
      },
    ],
  },
  i18n: op09KouzukiOden047I18n,
};
