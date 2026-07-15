import type { EventCard } from "@tcg/op-types";
import { eb01KingdomCome059I18n } from "./059-kingdom-come.i18n.ts";

export const eb01KingdomCome059: EventCard = {
  id: "EB01-059",
  canonicalId: "EB01-059",
  slug: "kingdom-come",
  name: "Kingdom Come",
  printings: [
    {
      id: "EB01-059",
      artId: "EB01-059",
      setCode: "EB01",
      collectorNumber: "059",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB01-059.jpg",
    },
  ],
  cardType: "event",
  color: ["yellow"],
  rarity: "R",
  setId: "EB01",
  cost: 6,
  traits: ["Sky Island"],
  effect:
    "[Main] K.O. up to 1 of your opponent's Characters. Then, trash cards from the top of your Life cards until you have 1 Life card.[Trigger] K.O. up to 1 of your opponent's Characters with a cost equal to or less than the total of your and your opponent's Life cards.",
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
            },
          },
        ],
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
                  filter: "dynamicCost",
                  comparison: "lte",
                  source: "totalLifeCount",
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: eb01KingdomCome059I18n,
};
