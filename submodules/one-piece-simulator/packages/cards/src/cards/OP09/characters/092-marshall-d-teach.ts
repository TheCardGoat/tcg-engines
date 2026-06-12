import type { CharacterCard } from "@tcg/op-types";
import { op09MarshallDTeach092I18n } from "./092-marshall-d-teach.i18n.ts";

export const op09MarshallDTeach092: CharacterCard = {
  id: "OP09-092",
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "OP09",
  cost: 3,
  power: 4000,
  counter: 1000,
  traits: ["Whitebeard Pirates"],
  attribute: "slash",
  effect:
    "[Activate: Main] You may rest this Character: If the number of cards in your hand is at least 3 less than the number in your opponent's hand, draw 2 cards and trash 1 card from your hand.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "restThisCard",
          },
        ],
        actions: [
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
  i18n: op09MarshallDTeach092I18n,
};
