import type { CharacterCard } from "@tcg/op-types";
import { op10Enel025I18n } from "./025-enel.i18n.ts";

export const op10Enel025: CharacterCard = {
  id: "OP10-025",
  canonicalId: "OP10-025",
  slug: "enel/op10-025",
  name: "Enel",
  printings: [
    {
      id: "OP10-025",
      artId: "OP10-025",
      setCode: "OP10",
      collectorNumber: "025",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP10-025.jpg",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "R",
  setId: "OP10",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["ODYSSEY Sky Island"],
  attribute: "special",
  effect:
    "[On Play] If you have 2 or more rested Characters, draw 3 cards and trash 2 cards from your hand.",
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
            amount: 3,
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
  i18n: op10Enel025I18n,
};
