import type { EventCard } from "@tcg/op-types";
import { op02ArabesqueBrickFist067I18n } from "./067-arabesque-brick-fist.i18n.ts";

export const op02ArabesqueBrickFist067: EventCard = {
  id: "OP02-067",
  canonicalId: "OP02-067",
  slug: "arabesque-brick-fist",
  name: "Arabesque Brick Fist",
  printings: [
    {
      id: "OP02-067",
      artId: "OP02-067",
      setCode: "OP02",
      collectorNumber: "067",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-067.jpg",
    },
  ],
  cardType: "event",
  color: ["blue"],
  rarity: "UC",
  setId: "OP02",
  cost: 2,
  traits: ["Fish-Man Impel Down"],
  effect:
    "[Main] Return up to 1 Character with a cost of 4 or less to the owner's hand. [Trigger] Activate this card's [Main] effect.",
  effects: {
    effects: [
      {
        trigger: "main",
        actions: [
          {
            action: "returnToHand",
            target: {
              player: "any",
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
  i18n: op02ArabesqueBrickFist067I18n,
};
