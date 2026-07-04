import type { EventCard } from "@tcg/op-types";
import { op01Overheat086I18n } from "./086-overheat.i18n.ts";

export const op01Overheat086: EventCard = {
  id: "OP01-086",
  canonicalId: "OP01-086",
  slug: "overheat",
  name: "Overheat",
  printings: [
    {
      id: "OP01-086",
      artId: "OP01-086",
      setCode: "OP01",
      collectorNumber: "086",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-086.jpg",
    },
  ],
  cardType: "event",
  color: ["blue"],
  rarity: "R",
  setId: "OP01",
  cost: 2,
  traits: ["Donquixote Pirates The Seven Warlords of the Sea"],
  effect:
    "[Counter] Up to 1 of your Leader or Character cards gains +4000 power during this battle. Then, return up to 1 active Character with a cost of 3 or less to the owner's hand. [Trigger] Return up to 1 card with a cost of 4 or less to the owner's hand.  This card has been officially errata'd.",
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
        ],
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "returnToHand",
            target: {
              player: "opponent",
              zones: ["leader", "character", "stage", "costArea"],
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
    ],
  },
  i18n: op01Overheat086I18n,
};
