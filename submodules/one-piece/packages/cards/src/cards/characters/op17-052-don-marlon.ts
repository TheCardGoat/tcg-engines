import type { CharacterCard } from "@tcg/op-types";
import { op17DonMarlon052I18n } from "./op17-052-don-marlon.i18n.ts";

export const op17DonMarlon052: CharacterCard = {
  id: "OP17-052",
  canonicalId: "OP17-052",
  slug: "don-marlon/op17-052",
  name: "Don Marlon",
  printings: [
    {
      id: "OP17-052",
      artId: "OP17-052",
      setCode: "OP17",
      collectorNumber: "052",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP17-052_2a1BRJl.jpg",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "OP17",
  cost: 3,
  power: 5000,
  traits: ["Rocks Pirates"],
  attribute: "ranged",
  effect: "[On Play] Add up to 1 blue Event with a cost of 0 from your trash to your hand.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "returnToHand",
            target: {
              player: "self",
              zones: ["trash"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "color",
                  value: "blue",
                },
                {
                  filter: "cardCategory",
                  value: "event",
                },
                {
                  filter: "cost",
                  comparison: "eq",
                  value: 0,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op17DonMarlon052I18n,
};
