import type { EventCard } from "@tcg/op-types";
import { op03FireFist018I18n } from "./018-fire-fist.i18n.ts";

export const op03FireFist018: EventCard = {
  id: "OP03-018",
  cardType: "event",
  color: ["red"],
  rarity: "R",
  setId: "OP03",
  cost: 3,
  traits: ["Whitebeard Pirates"],
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-018_p1.jpg",
      imageId: "OP03-018_p1",
    },
  ],
  effect:
    "[Main] You may trash 1 Event from your hand: K.O. up to 1 of your opponent's Characters with 5000 power or less and up to 1 of your opponent's Characters with 4000 power or less. [Trigger] K.O. up to 1 of your opponent's Characters with 5000 power or less.",
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
                  value: 5000,
                },
              ],
            },
          },
        ],
        optional: true,
      },
      {
        trigger: "trigger",
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
                  value: 5000,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op03FireFist018I18n,
};
