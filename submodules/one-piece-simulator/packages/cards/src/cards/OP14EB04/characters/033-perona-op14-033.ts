import type { CharacterCard } from "@tcg/op-types";
import { op14eb04PeronaOp14033033I18n } from "./033-perona-op14-033.i18n.ts";

export const op14eb04PeronaOp14033033: CharacterCard = {
  id: "OP14-033",
  cardType: "character",
  color: ["green"],
  rarity: "SR",
  setId: "OP14EB04",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["Thriller Bark Pirates Muggy Kingdom"],
  attribute: "special",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP14-033_p1_DLOzgD5.jpg",
      imageId: "OP14-033_p1",
    },
  ],
  effect:
    "[On Play] Up to 2 of your opponent's Characters with a cost of 5 or less cannot be rested until the end of your opponent's next End Phase.\n[On K.O.] You may rest 1 of your cards: Play up to 1 green Character card with a cost of 5 or less from your hand.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "cannotBeRested",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 2,
                upTo: true,
              },
              filters: [
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 5,
                },
              ],
            },
            duration: "untilEndOfOpponentNextTurn",
          },
        ],
      },
      {
        trigger: "onKo",
        costs: [
          {
            cost: "restCards",
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
              upTo: true,
            },
            filters: [
              {
                filter: "cost",
                comparison: "lte",
                value: 5,
              },
              {
                filter: "color",
                value: "green",
              },
              {
                filter: "cardCategory",
                value: "character",
              },
            ],
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op14eb04PeronaOp14033033I18n,
};
