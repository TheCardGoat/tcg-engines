import type { EventCard } from "@tcg/op-types";
import { op01SheepSHorn117I18n } from "./117-sheep-s-horn.i18n.ts";

export const op01SheepSHorn117: EventCard = {
  id: "OP01-117",
  canonicalId: "OP01-117",
  slug: "sheep-s-horn",
  name: "Sheep's Horn",
  printings: [
    {
      id: "OP01-117",
      artId: "OP01-117",
      setCode: "OP01",
      collectorNumber: "117",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-117.jpg",
    },
  ],
  cardType: "event",
  color: ["purple"],
  rarity: "C",
  setId: "OP01",
  cost: 2,
  traits: ["Animal Kingdom Pirates SMILE"],
  effect:
    "[Main] DON!! -1 (You may return the specified number of DON!! cards from your field to your DON!! deck.): Rest up to 1 of your opponent's Characters with a cost of 6 or less.  This card has been officially errata'd.",
  effects: {
    effects: [
      {
        trigger: "main",
        costs: [
          {
            cost: "returnDon",
            amount: 1,
          },
        ],
        actions: [
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
                  filter: "cost",
                  comparison: "lte",
                  value: 6,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op01SheepSHorn117I18n,
};
