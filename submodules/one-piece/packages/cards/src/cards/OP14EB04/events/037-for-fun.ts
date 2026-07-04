import type { EventCard } from "@tcg/op-types";
import { op14eb04ForFun037I18n } from "./037-for-fun.i18n.ts";

export const op14eb04ForFun037: EventCard = {
  id: "OP14-037",
  canonicalId: "OP14-037",
  slug: "for-fun",
  name: "For Fun",
  printings: [
    {
      id: "OP14-037",
      artId: "OP14-037",
      setCode: "OP14EB04",
      collectorNumber: "037",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP14-037_gbErsGE.jpg",
    },
  ],
  cardType: "event",
  color: ["green"],
  rarity: "R",
  setId: "OP14EB04",
  cost: 1,
  traits: ["The Seven Warlords of the Sea East Blue"],
  effect:
    "[Main] You may rest 3 of your cards: K.O. up to 1 of your opponent's rested Characters with 7000 base power or less.\n[Counter] Your Leader gains +3000 power during this battle.",
  effects: {
    effects: [
      {
        trigger: "main",
        costs: [
          {
            cost: "restCards",
            amount: 3,
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
                  filter: "state",
                  value: "rested",
                },
                {
                  filter: "basePower",
                  comparison: "lte",
                  value: 7000,
                },
              ],
            },
          },
        ],
        optional: true,
      },
      {
        trigger: "counter",
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
            duration: "thisBattle",
          },
        ],
      },
    ],
  },
  i18n: op14eb04ForFun037I18n,
};
