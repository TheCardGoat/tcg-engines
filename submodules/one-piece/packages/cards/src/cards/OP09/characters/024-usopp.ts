import type { CharacterCard } from "@tcg/op-types";
import { op09Usopp024I18n } from "./024-usopp.i18n.ts";

export const op09Usopp024: CharacterCard = {
  id: "OP09-024",
  canonicalId: "OP09-024",
  slug: "usopp/op09-024",
  name: "Usopp",
  printings: [
    {
      id: "OP09-024",
      artId: "OP09-024",
      setCode: "OP09",
      collectorNumber: "024",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-024.jpg",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "OP09",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Straw Hat Crew ODYSSEY"],
  attribute: "ranged",
  effect:
    "[On Play] If you have 2 or more rested Characters, draw 2 cards and trash 2 cards from your hand.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "zoneCount",
            player: "self",
            zone: "character",
            comparison: "gte",
            value: 2,
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
            amount: 2,
          },
          {
            action: "trashFromHand",
            player: "self",
            amount: 2,
          },
        ],
      },
    ],
  },
  i18n: op09Usopp024I18n,
};
