import type { EventCard } from "@tcg/op-types";
import { strawHat } from "../st01-helpers.ts";
import { st01GuardPoint014I18n } from "./st01-014-guard-point.i18n.ts";

export const st01GuardPoint014: EventCard = {
  id: "ST01-014",
  canonicalId: "ST01-014",
  slug: "guard-point",
  name: "Guard Point",
  printings: [
    {
      id: "ST01-014",
      artId: "ST01-014",
      setCode: "ST01",
      collectorNumber: "014",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST01-014.jpg",
    },
    {
      id: "ST01-014_p2",
      artId: "ST01-014_p2",
      setCode: "ST01",
      collectorNumber: "014",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST01-014_p2.jpg",
    },
    {
      id: "ST01-014_p3",
      artId: "ST01-014_p3",
      setCode: "ST01",
      collectorNumber: "014",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST01-014_p3.jpg",
      label: "Guard Point (Textured Foil)",
    },
    {
      id: "ST01-014_r1",
      artId: "ST01-014_r1",
      setCode: "ST01",
      collectorNumber: "014",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST01-014_r1.jpg",
    },
  ],
  cardType: "event",
  color: ["red"],
  rarity: "C",
  setId: "ST01",
  cost: 1,
  traits: strawHat,
  trigger:
    "[Trigger] Up to 1 of your Leader or Character cards gains +1000 power during this turn.",
  effect:
    "[Counter] Up to 1 of your Leader or Character cards gains +3000 power during this battle.",
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
              count: { amount: 1, upTo: true },
            },
            value: 3000,
            duration: "thisBattle",
          },
        ],
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: { amount: 1, upTo: true },
            },
            value: 1000,
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: st01GuardPoint014I18n,
};
