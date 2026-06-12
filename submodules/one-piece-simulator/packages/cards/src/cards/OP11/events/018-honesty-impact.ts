import type { EventCard } from "@tcg/op-types";
import { op11HonestyImpact018I18n } from "./018-honesty-impact.i18n.ts";

export const op11HonestyImpact018: EventCard = {
  id: "OP11-018",
  cardType: "event",
  color: ["red"],
  rarity: "R",
  setId: "OP11",
  cost: 6,
  trigger: "K.O. up to 1 of your opponent's Characters with 6000 power or less.",
  traits: ["Navy SWORD"],
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP11-018_p1.jpg",
      imageId: "OP11-018_p1",
    },
  ],
  effect:
    "[Main] Give up to 1 of your opponent's Characters 4000 power during this turn. Then, K.O. up to 1 of your opponent's Characters with 6000 power or less.",
  effects: {
    effects: [
      {
        trigger: "main",
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
            value: 4000,
            duration: "thisTurn",
          },
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
                  value: 6000,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op11HonestyImpact018I18n,
};
