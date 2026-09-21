import type { EventCard } from "@tcg/op-types";
import { op03ThunderBolt121I18n } from "./op03-121-thunder-bolt.i18n.ts";

export const op03ThunderBolt121: EventCard = {
  id: "OP03-121",
  canonicalId: "OP03-121",
  slug: "thunder-bolt",
  name: "Thunder Bolt",
  printings: [
    {
      id: "OP03-121",
      artId: "OP03-121",
      setCode: "OP03",
      collectorNumber: "121",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-121.jpg",
    },
    {
      id: "OP03-121_p3",
      artId: "OP03-121_p3",
      setCode: "OP03",
      collectorNumber: "121",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-121_p3.jpg",
    },
    {
      id: "OP03-121_p4",
      artId: "OP03-121_p4",
      setCode: "OP03",
      collectorNumber: "121",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-121_p4.jpg",
      label: "Thunder Bolt (Textured Foil)",
    },
    {
      id: "OP03-121_r2",
      artId: "OP03-121_r2",
      setCode: "OP03",
      collectorNumber: "121",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-121_r2.jpg",
    },
  ],
  cardType: "event",
  color: ["yellow"],
  rarity: "C",
  setId: "OP03",
  cost: 2,
  traits: ["The Four Emperors Big Mom Pirates"],
  effect:
    "[Main] You may trash 1 card from the top of your Life cards: K.O. up to 1 of your opponent's Characters with a cost of 5 or less. [Trigger] K.O. up to 1 of your opponent's Characters with a cost of 5 or less.",
  effects: {
    effects: [
      {
        trigger: "main",
        costs: [
          {
            cost: "trashLife",
            amount: 1,
            position: "top",
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
                  filter: "cost",
                  comparison: "lte",
                  value: 5,
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
                  filter: "cost",
                  comparison: "lte",
                  value: 5,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op03ThunderBolt121I18n,
};
