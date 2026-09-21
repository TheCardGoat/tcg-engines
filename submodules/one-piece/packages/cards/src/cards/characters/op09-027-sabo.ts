import type { CharacterCard } from "@tcg/op-types";
import { op09Sabo027I18n } from "./op09-027-sabo.i18n.ts";

export const op09Sabo027: CharacterCard = {
  id: "OP09-027",
  canonicalId: "OP09-027",
  slug: "sabo/op09-027",
  name: "Sabo",
  printings: [
    {
      id: "OP09-027",
      artId: "OP09-027",
      setCode: "OP09",
      collectorNumber: "027",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-027.jpg",
    },
    {
      id: "OP09-027_p1",
      artId: "OP09-027_p1",
      setCode: "OP09",
      collectorNumber: "027",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-027_p1.jpg",
    },
    {
      id: "OP09-027_r1",
      artId: "OP09-027_r1",
      setCode: "OP09",
      collectorNumber: "027",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-027_r1.jpg",
      label: "Sabo - OP09-027 (Reprint)",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "UC",
  setId: "OP09",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["Revolutionary Army ODYSSEY"],
  attribute: "special",
  effect: "[When Attacking] [Once Per Turn] If you have 3 or more rested Characters, draw 1 card.",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
        conditions: [
          {
            condition: "zoneCount",
            player: "self",
            zone: "character",
            comparison: "gte",
            value: 3,
            filters: [
              {
                filter: "state",
                value: "rested",
              },
            ],
          },
        ],
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: op09Sabo027I18n,
};
