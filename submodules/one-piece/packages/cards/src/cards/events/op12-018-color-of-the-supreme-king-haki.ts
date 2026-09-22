import type { EventCard } from "@tcg/op-types";
import { op12ColorOfTheSupremeKingHaki018I18n } from "./op12-018-color-of-the-supreme-king-haki.i18n.ts";

export const op12ColorOfTheSupremeKingHaki018: EventCard = {
  id: "OP12-018",
  canonicalId: "OP12-018",
  slug: "color-of-the-supreme-king-haki/op12-018",
  name: "Color of the Supreme King Haki",
  printings: [
    {
      id: "OP12-018",
      artId: "OP12-018",
      setCode: "OP12",
      collectorNumber: "018",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP12-018_okNcO1t.jpg",
    },
  ],
  cardType: "event",
  color: ["red"],
  rarity: "R",
  setId: "OP12",
  cost: 0,
  traits: ["Former Roger Pirates"],
  effect:
    "[Counter] Up to 1 of your Characters or [Silvers Rayleigh] gains +2000 power during this battle. Then, you may rest 1 of your DON!! cards. If you do, give your opponent's Leader and all of their Characters -1000 power during this turn.",
  effects: {
    effects: [
      {
        trigger: "counter",
        optional: true,
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: 2000,
            duration: "thisBattle",
          },
          {
            action: "rest",
            target: {
              player: "self",
              zones: ["costArea"],
              count: {
                amount: 1,
              },
            },
            condition: {
              condition: "activeDonCount",
              comparison: "gte",
              value: 1,
            },
          },
          {
            action: "modifyPower",
            target: {
              player: "opponent",
              zones: ["leader", "character"],
              count: {
                amount: "all",
              },
            },
            value: -1000,
            duration: "thisTurn",
            condition: {
              condition: "restedCardCount",
              player: "self",
              comparison: "gte",
              value: 1,
            },
          },
        ],
      },
    ],
  },
  i18n: op12ColorOfTheSupremeKingHaki018I18n,
};
