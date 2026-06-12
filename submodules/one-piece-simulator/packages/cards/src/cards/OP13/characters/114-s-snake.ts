import type { CharacterCard } from "@tcg/op-types";
import { op13SSnake114I18n } from "./114-s-snake.i18n.ts";

export const op13SSnake114: CharacterCard = {
  id: "OP13-114",
  cardType: "character",
  color: ["yellow"],
  rarity: "R",
  setId: "OP13",
  cost: 4,
  power: 5000,
  counter: 1000,
  trigger: "You may trash 1 card from your hand: Play this card.",
  traits: ["Egghead Seraphim"],
  attribute: "special",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP13-114_p1_OWb9veP.jpg",
      imageId: "OP13-114_p1",
    },
  ],
  effect:
    "[On Play]/[When Attacking] You may turn 1 card from the top of your Life cards face-up: Give up to 1 of your opponent's Characters 2000 power during this turn.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "turnLifeFaceUp",
            count: 1,
          },
        ],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: 2000,
            duration: "thisTurn",
          },
        ],
        optional: true,
      },
      {
        trigger: "whenAttacking",
        costs: [
          {
            cost: "turnLifeFaceUp",
            count: 1,
          },
        ],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: 2000,
            duration: "thisTurn",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op13SSnake114I18n,
};
