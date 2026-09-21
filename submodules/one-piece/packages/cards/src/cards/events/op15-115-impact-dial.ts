import type { EventCard } from "@tcg/op-types";
import { op15ImpactDial115I18n } from "./op15-115-impact-dial.i18n.ts";

export const op15ImpactDial115: EventCard = {
  id: "OP15-115",
  canonicalId: "OP15-115",
  slug: "impact-dial/op15-115",
  name: "Impact Dial",
  printings: [
    {
      id: "OP15-115",
      artId: "OP15-115",
      setCode: "OP15",
      collectorNumber: "115",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP15-115_yPqMKM2.jpg",
    },
  ],
  cardType: "event",
  color: ["yellow"],
  rarity: "C",
  setId: "OP15",
  cost: 2,
  traits: ["Straw Hat Crew Sky Island"],
  effect:
    "[Main] K.O. up to 1 of your opponent's Characters with a cost of 4 or less. Then, add 1 card from the top of your Life cards to your hand.",
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
                  filter: "cost",
                  comparison: "lte",
                  value: 4,
                },
              ],
            },
          },
          {
            action: "removeFromLife",
            player: "self",
            count: {
              amount: 1,
            },
            destination: "hand",
            position: "top",
          },
        ],
      },
    ],
  },
  i18n: op15ImpactDial115I18n,
};
