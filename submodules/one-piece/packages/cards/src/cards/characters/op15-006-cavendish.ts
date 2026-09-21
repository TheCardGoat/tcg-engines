import type { CharacterCard } from "@tcg/op-types";
import { op15Cavendish006I18n } from "./op15-006-cavendish.i18n.ts";

export const op15Cavendish006: CharacterCard = {
  id: "OP15-006",
  canonicalId: "OP15-006",
  slug: "cavendish/op15-006",
  name: "Cavendish",
  printings: [
    {
      id: "OP15-006",
      artId: "OP15-006",
      setCode: "OP15",
      collectorNumber: "006",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP15-006_9i9slYu.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "UC",
  setId: "OP15",
  cost: 4,
  power: 4000,
  counter: 2000,
  traits: ["Beautiful Pirates Dressrosa"],
  attribute: "slash",
  effect: "If you have 4 or more Events in your trash, this Character gains +2000 power.",
  effects: {
    permanentEffects: [
      {
        conditions: [
          {
            condition: "zoneCount",
            player: "self",
            zone: "trash",
            comparison: "gte",
            value: 4,
            filters: [
              {
                filter: "cardCategory",
                value: "event",
              },
            ],
          },
        ],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            value: 2000,
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: op15Cavendish006I18n,
};
