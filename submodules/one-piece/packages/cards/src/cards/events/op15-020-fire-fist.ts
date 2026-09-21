import type { EventCard } from "@tcg/op-types";
import { op15FireFist020I18n } from "./op15-020-fire-fist.i18n.ts";

export const op15FireFist020: EventCard = {
  id: "OP15-020",
  canonicalId: "OP15-020",
  slug: "fire-fist/op15-020",
  name: "Fire Fist",
  printings: [
    {
      id: "OP15-020",
      artId: "OP15-020",
      setCode: "OP15",
      collectorNumber: "020",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP15-020_gnZjvrN.jpg",
    },
  ],
  cardType: "event",
  color: ["red"],
  rarity: "R",
  setId: "OP15",
  cost: 7,
  traits: ["Revolutionary Army Dressrosa"],
  effect:
    "[Main] Your Leader gains +3000 power during this turn and give up to 1 of your opponent's Characters -8000 power until the end of your opponent's next End Phase. Then, you may trash 2 cards from your hand. If you do, K.O. up to 1 of your opponent's Characters with 0 power or less.",
  effects: {
    effects: [
      {
        trigger: "main",
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["leader"],
              count: {
                amount: 1,
              },
            },
            value: 3000,
            duration: "thisTurn",
          },
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
            value: -8000,
            duration: "untilEndOfOpponentNextEndPhase",
          },
        ],
      },
      {
        trigger: "main",
        costs: [
          {
            cost: "trashFromHand",
            amount: 2,
          },
        ],
        actions: [
          {
            action: "ko",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "power",
                  comparison: "lte",
                  value: 0,
                },
              ],
            },
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op15FireFist020I18n,
};
