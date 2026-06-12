import type { CharacterCard } from "@tcg/op-types";
import { op14eb04IsshoEb04022022I18n } from "./022-issho-eb04-022.i18n.ts";

export const op14eb04IsshoEb04022022: CharacterCard = {
  id: "EB04-022",
  cardType: "character",
  color: ["blue"],
  rarity: "R",
  setId: "OP14EB04",
  cost: 5,
  power: 7000,
  traits: ["Navy Dressrosa"],
  attribute: "slash",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB04-022_p1_SP2d53S.jpg",
      imageId: "EB04-022_p1",
    },
  ],
  effect:
    "[On Play] You may trash 2 cards from your hand: If your opponent has 6 or more cards in their hand, your opponent places 2 cards from their hand at the bottom of their deck in any order.\n[DON!! x1] [When Attacking] You may trash 1 card from your hand: Give up to 1 of your opponent's Characters 2000 power during this turn.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "handCount",
            player: "opponent",
            comparison: "gte",
            value: 6,
          },
        ],
        costs: [
          {
            cost: "trashFromHand",
            amount: 2,
          },
        ],
        actions: [
          {
            action: "returnToDeck",
            target: {
              player: "opponent",
              zones: ["hand"],
              count: {
                amount: 2,
              },
            },
            position: "bottom",
          },
        ],
        optional: true,
      },
      {
        trigger: "whenAttacking",
        conditions: [
          {
            condition: "donAttached",
            amount: 1,
          },
        ],
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
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
  i18n: op14eb04IsshoEb04022022I18n,
};
