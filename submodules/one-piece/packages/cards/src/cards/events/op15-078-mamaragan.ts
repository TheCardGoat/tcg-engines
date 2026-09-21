import type { EventCard } from "@tcg/op-types";
import { op15Mamaragan078I18n } from "./op15-078-mamaragan.i18n.ts";

export const op15Mamaragan078: EventCard = {
  id: "OP15-078",
  canonicalId: "OP15-078",
  slug: "mamaragan/op15-078",
  name: "Mamaragan",
  printings: [
    {
      id: "OP15-078",
      artId: "OP15-078",
      setCode: "OP15",
      collectorNumber: "078",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP15-078_Mxy2D9w.jpg",
    },
    {
      id: "OP15-078_p1",
      artId: "OP15-078_p1",
      setCode: "OP15",
      collectorNumber: "078",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP15-078_p1_7BksWoF.jpg",
      label: "Mamaragan (Alternate Art)",
    },
  ],
  cardType: "event",
  color: ["purple"],
  rarity: "SR",
  setId: "OP15",
  cost: 0,
  traits: ["Sky Island"],
  effect:
    "[Main] DON!! 2: Draw 1 card. Then, rest up to 1 of your opponent's Characters with 5000 power or less.\n[Counter] Up to 1 of your Leader or Character cards gains +1000 power during this battle. Then, if you have 6 or less DON!! cards on your field, draw 1 card.",
  effects: {
    effects: [
      {
        trigger: "main",
        costs: [
          {
            cost: "returnDon",
            amount: 2,
          },
        ],
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
          {
            action: "rest",
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
      {
        trigger: "counter",
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: 1000,
            duration: "thisBattle",
          },
          {
            action: "draw",
            player: "self",
            amount: 1,
            condition: {
              condition: "donFieldCount",
              player: "self",
              comparison: "lte",
              value: 6,
            },
          },
        ],
      },
    ],
  },
  i18n: op15Mamaragan078I18n,
};
