import type { EventCard } from "@tcg/op-types";
import { op10SpecialLongRangeAttackBagworm061I18n } from "./061-special-long-range-attack-bagworm.i18n.ts";

export const op10SpecialLongRangeAttackBagworm061: EventCard = {
  id: "OP10-061",
  canonicalId: "OP10-061",
  slug: "special-long-range-attack-bagworm",
  name: "Special Long-Range Attack!! Bagworm",
  printings: [
    {
      id: "OP10-061",
      artId: "OP10-061",
      setCode: "OP10",
      collectorNumber: "061",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP10-061.jpg",
    },
  ],
  cardType: "event",
  color: ["blue"],
  rarity: "UC",
  setId: "OP10",
  cost: 3,
  trigger: "Return up to 1 Character with a cost of 2 or less to the owner's hand.",
  traits: ["Straw Hat Crew Dressrosa"],
  effect:
    "[Main] Draw 1 card. Then, return up to 1 of your opponent's Characters with a cost of 2 or less to the owner's hand.",
  effects: {
    effects: [
      {
        trigger: "main",
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
          {
            action: "returnToHand",
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
                  value: 2,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op10SpecialLongRangeAttackBagworm061I18n,
};
