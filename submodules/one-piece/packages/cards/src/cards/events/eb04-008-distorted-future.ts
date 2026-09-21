import type { EventCard } from "@tcg/op-types";
import { eb04DistortedFuture008I18n } from "./eb04-008-distorted-future.i18n.ts";

export const eb04DistortedFuture008: EventCard = {
  id: "EB04-008",
  canonicalId: "EB04-008",
  slug: "distorted-future/eb04-008",
  name: "Distorted Future",
  printings: [
    {
      id: "EB04-008",
      artId: "EB04-008",
      setCode: "EB04",
      collectorNumber: "008",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB04-008_1Lv4qfb.jpg",
    },
  ],
  cardType: "event",
  color: ["red"],
  rarity: "R",
  setId: "EB04",
  cost: 1,
  traits: ["Bonney Pirates Egghead"],
  effect:
    "[Main] If you have 2 or less Life cards, give up to 1 of your opponent's Characters -3000 power during this turn.[Counter] Your Leader gains +3000 power during this battle.",
  effects: {
    effects: [
      {
        trigger: "main",
        conditions: [
          {
            condition: "lifeCount",
            player: "self",
            comparison: "lte",
            value: 2,
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
            value: -3000,
            duration: "thisTurn",
          },
        ],
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
  i18n: eb04DistortedFuture008I18n,
};
