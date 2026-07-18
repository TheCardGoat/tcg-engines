import type { CharacterCard } from "@tcg/op-types";
import { op06Raizo112I18n } from "./112-raizo.i18n.ts";

export const op06Raizo112: CharacterCard = {
  id: "OP06-112",
  canonicalId: "OP06-112",
  slug: "raizo/op06-112",
  name: "Raizo",
  printings: [
    {
      id: "OP06-112",
      artId: "OP06-112",
      setCode: "OP06",
      collectorNumber: "112",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-112.jpg",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "OP06",
  cost: 3,
  power: 4000,
  counter: 1000,
  trigger: "If your opponent has 3 or less Life cards, play this card.",
  traits: ["Land of Wano The Akazaya Nine"],
  attribute: "slash",
  effect:
    "[When Attacking] You may trash 1 card from your hand: Rest up to 1 of your opponent's DON!! cards.",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "rest",
            target: {
              player: "opponent",
              zones: ["costArea"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
          },
        ],
        optional: true,
      },
      {
        trigger: "trigger",
        conditions: [
          {
            condition: "lifeCount",
            player: "opponent",
            comparison: "lte",
            value: 3,
          },
        ],
        actions: [
          {
            action: "playThisCard",
          },
        ],
      },
    ],
  },
  i18n: op06Raizo112I18n,
};
