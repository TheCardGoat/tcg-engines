import type { EventCard } from "@tcg/op-types";
import { op02ArabesqueBrickFist067I18n } from "./067-arabesque-brick-fist.i18n.ts";

export const op02ArabesqueBrickFist067: EventCard = {
  id: "OP02-067",
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
