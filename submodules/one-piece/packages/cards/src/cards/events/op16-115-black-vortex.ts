import type { EventCard } from "@tcg/op-types";
import { op16BlackVortex115I18n } from "./op16-115-black-vortex.i18n.ts";

export const op16BlackVortex115: EventCard = {
  id: "OP16-115",
  canonicalId: "OP16-115",
  slug: "black-vortex/op16-115",
  name: "Black Vortex",
  printings: [
    {
      id: "OP16-115",
      artId: "OP16-115",
      setCode: "OP16",
      collectorNumber: "115",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP16-115_HL9Sq9n.jpg",
    },
  ],
  cardType: "event",
  color: ["yellow"],
  rarity: "UC",
  setId: "OP16",
  cost: 1,
  trigger:
    "Negate the effect of up to 1 of your opponent's Leader or Character cards during this turn.",
  traits: ["Blackbeard Pirates The Seven Warlords of the Sea"],
  effect:
    "[Main] If your Leader has the {Blackbeard Pirates} type, add up to 1 card with a [Trigger] other than [Black Vortex] from your trash to your hand.",
  effects: {
    effects: [
      {
        trigger: "main",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Blackbeard Pirates",
            match: "includes",
          },
        ],
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
                  filter: "hasTrigger",
                  value: true,
                },
                {
                  filter: "excludeName",
                  value: "Black Vortex",
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op16BlackVortex115I18n,
};
