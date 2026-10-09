import type { EventCard } from "@tcg/op-types";
import { st03Sables015I18n } from "./st03-015-sables.i18n.ts";

export const st03Sables015: EventCard = {
  id: "ST03-015",
  canonicalId: "ST03-015",
  slug: "sables/st03-015",
  name: "Sables",
  printings: [
    {
      id: "ST03-015",
      artId: "ST03-015",
      setCode: "ST03",
      collectorNumber: "015",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST03-015.jpg",
    },
  ],
  cardType: "event",
  color: ["blue"],
  rarity: "C",
  setId: "ST03",
  traits: ["The Seven Warlords of the Sea", "Baroque Works"],
  cost: 4,
  effect: "[Main] Return up to 1 Character with a cost of 7 or less to the owner's hand.",
  trigger: "Activate this card's [Main] effect.",
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
                  value: 7,
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
  i18n: st03Sables015I18n,
};
