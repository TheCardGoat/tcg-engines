import type { EventCard } from "@tcg/op-types";
import { op07SlaveArrow056I18n } from "./056-slave-arrow.i18n.ts";

export const op07SlaveArrow056: EventCard = {
  id: "OP07-056",
  canonicalId: "OP07-056",
  slug: "slave-arrow",
  name: "Slave Arrow",
  printings: [
    {
      id: "OP07-056",
      artId: "OP07-056",
      setCode: "OP07",
      collectorNumber: "056",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP07-056.jpg",
    },
  ],
  cardType: "event",
  color: ["blue"],
  rarity: "UC",
  setId: "OP07",
  cost: 1,
  traits: ["Kuja Pirates The Seven Warlords of the Sea"],
  effect:
    "[Counter] You may return 1 of your Characters with a cost of 2 or more to the owner's hand: Up to 1 of your Leader or Character cards gains +4000 power during this battle. [Trigger] Draw 2 cards and place 2 cards from your hand at the bottom of your deck in any order.",
  effects: {
    effects: [
      {
        trigger: "counter",
        costs: [
          {
            cost: "returnCharacter",
            amount: 1,
            filters: [
              {
                filter: "cost",
                comparison: "gte",
                value: 2,
              },
            ],
          },
        ],
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
        optional: true,
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 2,
          },
          {
            action: "returnToDeck",
            target: {
              player: "self",
              zones: ["hand"],
              count: {
                amount: 2,
              },
            },
            position: "bottom",
            order: "any",
          },
        ],
      },
    ],
  },
  i18n: op07SlaveArrow056I18n,
};
