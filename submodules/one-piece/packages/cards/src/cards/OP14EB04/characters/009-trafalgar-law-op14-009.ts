import type { CharacterCard } from "@tcg/op-types";
import { op14eb04TrafalgarLawOp14009009I18n } from "./009-trafalgar-law-op14-009.i18n.ts";

export const op14eb04TrafalgarLawOp14009009: CharacterCard = {
  id: "OP14-009",
  canonicalId: "OP14-009",
  slug: "trafalgar-law-op14-009",
  name: "Trafalgar Law - OP14-009",
  printings: [
    {
      id: "OP14-009",
      artId: "OP14-009",
      setCode: "OP14EB04",
      collectorNumber: "009",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP14-009_PbcDe5b.jpg",
    },
    {
      id: "OP14-009_p1",
      artId: "OP14-009_p1",
      setCode: "OP14EB04",
      collectorNumber: "009",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP14-009_p1_xfgCC7W.jpg",
    },
  ],
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
            action: "swapBasePower",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
            },
            pairedTarget: {
              player: "self",
              zones: ["leader"],
              count: {
                amount: 1,
              },
            },
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
