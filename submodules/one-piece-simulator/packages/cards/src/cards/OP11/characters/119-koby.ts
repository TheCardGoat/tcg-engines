import type { CharacterCard } from "@tcg/op-types";
import { op11Koby119I18n } from "./119-koby.i18n.ts";

export const op11Koby119: CharacterCard = {
  id: "OP11-119",
  cardType: "character",
  color: ["black"],
  rarity: "SEC",
  setId: "OP11",
  cost: 8,
  power: 9000,
  traits: ["Navy SWORD"],
  attribute: "strike",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP11-119_p1.jpg",
      imageId: "OP11-119_p1",
    },
  ],
  effect:
    "[On Play] Up to 1 of your Characters can also attack active Characters during this turn.\n[When Attacking] You may place 2 cards from your trash at the bottom of your deck in any order: Up to 1 of your Leader or Character cards gains +1000 power until the end of your opponent's next turn.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "canAttackActive",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            duration: "thisTurn",
          },
        ],
      },
      {
        trigger: "whenAttacking",
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: 1000,
            duration: "untilEndOfOpponentNextTurn",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op11Koby119I18n,
};
