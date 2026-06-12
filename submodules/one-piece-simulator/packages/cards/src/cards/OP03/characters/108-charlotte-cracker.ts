import type { CharacterCard } from "@tcg/op-types";
import { op03CharlotteCracker108I18n } from "./108-charlotte-cracker.i18n.ts";

export const op03CharlotteCracker108: CharacterCard = {
  id: "OP03-108",
  cardType: "character",
  color: ["yellow"],
  rarity: "SR",
  setId: "OP03",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Big Mom Pirates"],
  attribute: "slash",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-108_p1.jpg",
      imageId: "OP03-108_p1",
    },
  ],
  effect:
    "[DON!! x1] If you have less Life cards than your opponent, this Character gains [Double Attack] and +1000 power. (This card deals 2 damage.) [Trigger] You may trash 1 card from your hand: Play this card.",
  effects: {
    effects: [
      {
        trigger: "trigger",
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "play",
            source: {
              player: "self",
              zone: "hand",
            },
            count: {
              amount: 1,
            },
          },
        ],
        optional: true,
      },
    ],
    permanentEffects: [
      {
        conditions: [
          {
            condition: "donAttached",
            amount: 1,
          },
          {
            condition: "lifeComparison",
            selfComparison: "lt",
          },
        ],
        actions: [
          {
            action: "grantKeyword",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            keyword: "doubleAttack",
            duration: "permanent",
          },
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            value: 1000,
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: op03CharlotteCracker108I18n,
};
