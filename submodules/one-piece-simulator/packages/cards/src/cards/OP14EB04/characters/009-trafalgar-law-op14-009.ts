import type { CharacterCard } from "@tcg/op-types";
import { op14eb04TrafalgarLawOp14009009I18n } from "./009-trafalgar-law-op14-009.i18n.ts";

export const op14eb04TrafalgarLawOp14009009: CharacterCard = {
  id: "OP14-009",
  cardType: "character",
  color: ["red"],
  rarity: "SR",
  setId: "OP14EB04",
  cost: 9,
  power: 10000,
  traits: ["Heart Pirates Supernovas The Seven Warlords of the Sea"],
  attribute: "slash",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP14-009_p1_xfgCC7W.jpg",
      imageId: "OP14-009_p1",
    },
  ],
  effect:
    "[Rush] [On Your Opponent's Attack] [Once Per Turn] You may trash 2 cards from your hand: Select your Leader and 1 Character. Swap the base power of the selected cards with each other during this battle.",
  effects: {
    keywords: ["rush"],
    effects: [
      {
        trigger: "onOpponentAttack",
        costs: [
          {
            cost: "trashFromHand",
            amount: 2,
          },
        ],
        actions: [
          {
            action: "setPower",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: {
                amount: 2,
              },
            },
            value: 0,
            duration: "thisBattle",
          },
        ],
        optional: true,
        oncePerTurn: true,
      },
    ],
  },
  i18n: op14eb04TrafalgarLawOp14009009I18n,
};
