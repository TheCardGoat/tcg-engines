import type { EventCard } from "@tcg/op-types";
import { op10LittleBlackBears080I18n } from "./080-little-black-bears.i18n.ts";

export const op10LittleBlackBears080: EventCard = {
  id: "OP10-080",
  canonicalId: "OP10-080",
  slug: "little-black-bears",
  name: "Little Black Bears",
  printings: [
    {
      id: "OP10-080",
      artId: "OP10-080",
      setCode: "OP10",
      collectorNumber: "080",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP10-080.jpg",
    },
  ],
  cardType: "event",
  color: ["purple"],
  rarity: "C",
  setId: "OP10",
  cost: 3,
  trigger: "Add up to 1 DON!! card from your DON!! deck and set it as active.",
  traits: ["Donquixote Pirates"],
  effect:
    "[Counter] Up to 1 of your Leader or Character cards gains +4000 power during this battle. Then, if you have 7 or more DON!! cards on your field and 5 or less cards in your hand, draw 1 card.",
  effects: {
    effects: [
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
            value: 4000,
            duration: "thisBattle",
          },
          {
            action: "draw",
            player: "self",
            amount: 1,
            condition: {
              condition: "compound",
              operator: "and",
              conditions: [
                { condition: "donFieldCount", player: "self", comparison: "gte", value: 7 },
                { condition: "handCount", player: "self", comparison: "lte", value: 5 },
              ],
            },
          },
        ],
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "addDon",
            count: { amount: 1, upTo: true },
            state: "active",
          },
        ],
      },
    ],
  },
  i18n: op10LittleBlackBears080I18n,
};
