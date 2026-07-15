import type { EventCard } from "@tcg/op-types";
import { op01ElephantSMarchoo115I18n } from "./115-elephant-s-marchoo.i18n.ts";

export const op01ElephantSMarchoo115: EventCard = {
  id: "OP01-115",
  canonicalId: "OP01-115",
  slug: "elephant-s-marchoo",
  name: "Elephant's Marchoo",
  printings: [
    {
      id: "OP01-115",
      artId: "OP01-115",
      setCode: "OP01",
      collectorNumber: "115",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-115.jpg",
    },
  ],
  cardType: "event",
  color: ["purple"],
  rarity: "C",
  setId: "OP01",
  cost: 4,
  traits: ["Animal Kingdom Pirates SMILE"],
  effect:
    "[Main] K.O. up to 1 of your opponent's Characters with a cost of 2 or less, then add up to 1 DON!! card from your DON!! deck and set it as active. [Trigger] Activate this card's [Main] effect.  This card has been officially errata'd.",
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
                  value: 2,
                },
              ],
            },
          },
          {
            action: "addDon",
            count: {
              amount: 1,
              upTo: true,
            },
            state: "active",
          },
        ],
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "activateEffect",
            effectTrigger: "main",
          },
        ],
      },
    ],
  },
  i18n: op01ElephantSMarchoo115I18n,
};
