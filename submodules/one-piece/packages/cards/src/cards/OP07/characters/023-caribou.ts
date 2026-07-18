import type { CharacterCard } from "@tcg/op-types";
import { op07Caribou023I18n } from "./023-caribou.i18n.ts";

export const op07Caribou023: CharacterCard = {
  id: "OP07-023",
  canonicalId: "OP07-023",
  slug: "caribou/op07-023",
  name: "Caribou",
  printings: [
    {
      id: "OP07-023",
      artId: "OP07-023",
      setCode: "OP07",
      collectorNumber: "023",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP07-023.jpg",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "UC",
  setId: "OP07",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Caribou Pirates Supernovas"],
  attribute: "special",
  effect:
    "If you have 6 or more rested DON!! cards, this Character gains +1000 power. [Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)",
  effects: {
    keywords: ["blocker"],
    permanentEffects: [
      {
        conditions: [
          {
            condition: "donFieldCount",
            player: "self",
            comparison: "gte",
            value: 6,
            state: "rested",
          },
        ],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["character"],
              count: { amount: 1 },
              self: true,
            },
            value: 1000,
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: op07Caribou023I18n,
};
