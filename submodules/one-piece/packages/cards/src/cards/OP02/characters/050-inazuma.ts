import type { CharacterCard } from "@tcg/op-types";
import { op02Inazuma050I18n } from "./050-inazuma.i18n.ts";

export const op02Inazuma050: CharacterCard = {
  id: "OP02-050",
  canonicalId: "OP02-050",
  slug: "inazuma/op02-050",
  name: "Inazuma",
  printings: [
    {
      id: "OP02-050",
      artId: "OP02-050",
      setCode: "OP02",
      collectorNumber: "050",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-050.jpg",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "R",
  setId: "OP02",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Revolutionary Army Impel Down"],
  attribute: "slash",
  effect:
    "If you have 1 or less cards in your hand, this Character gains +2000 power. [Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)",
  effects: {
    keywords: ["blocker"],
    permanentEffects: [
      {
        conditions: [
          {
            condition: "handCount",
            player: "self",
            comparison: "lte",
            value: 1,
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
  i18n: op02Inazuma050I18n,
};
