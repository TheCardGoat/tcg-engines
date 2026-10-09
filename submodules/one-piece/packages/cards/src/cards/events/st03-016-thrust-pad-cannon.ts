import type { EventCard } from "@tcg/op-types";
import { st03ThrustPadCannon016I18n } from "./st03-016-thrust-pad-cannon.i18n.ts";

export const st03ThrustPadCannon016: EventCard = {
  id: "ST03-016",
  canonicalId: "ST03-016",
  slug: "thrust-pad-cannon/st03-016",
  name: "Thrust Pad Cannon",
  printings: [
    {
      id: "ST03-016",
      artId: "ST03-016",
      setCode: "ST03",
      collectorNumber: "016",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST03-016.jpg",
    },
  ],
  cardType: "event",
  color: ["blue"],
  rarity: "C",
  setId: "ST03",
  traits: ["The Seven Warlords of the Sea", "Revolutionary Army"],
  cost: 2,
  effect: "[Counter] Return up to 1 Character with a cost of 3 or less to the owner's hand.",
  trigger: "Activate this card's [Counter] effect.",
  effects: {
    effects: [
      {
        trigger: "counter",
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
                  value: 3,
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
            effectTrigger: "counter",
          },
        ],
      },
    ],
  },
  i18n: st03ThrustPadCannon016I18n,
};
