import type { EventCard } from "@tcg/op-types";
import { op10DivineDeparture019I18n } from "./019-divine-departure.i18n.ts";

export const op10DivineDeparture019: EventCard = {
  id: "OP10-019",
  cardType: "event",
  color: ["red"],
  rarity: "R",
  setId: "OP10",
  cost: 1,
  traits: ["The Four Emperors Red-Haired Pirates"],
  artVariants: [
    {
      type: "parallel",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP10-019_p1.jpg",
      imageId: "OP10-019_p1",
    },
  ],
  effect:
    "[Main] You may rest 5 of your DON!! cards: K.O. up to 1 of your opponent's Characters with 8000 power or less.\n[Counter] Up to 1 of your Leader gains +3000 power during this battle.",
  effects: {
    effects: [
      {
        trigger: "main",
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
                  value: 8000,
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
                upTo: true,
              },
            },
            value: 3000,
            duration: "thisBattle",
          },
        ],
      },
    ],
  },
  i18n: op10DivineDeparture019I18n,
};
