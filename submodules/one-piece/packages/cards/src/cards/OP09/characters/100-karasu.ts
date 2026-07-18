import type { CharacterCard } from "@tcg/op-types";
import { op09Karasu100I18n } from "./100-karasu.i18n.ts";

export const op09Karasu100: CharacterCard = {
  id: "OP09-100",
  canonicalId: "OP09-100",
  slug: "karasu/op09-100",
  name: "Karasu",
  printings: [
    {
      id: "OP09-100",
      artId: "OP09-100",
      setCode: "OP09",
      collectorNumber: "100",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-100.jpg",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "UC",
  setId: "OP09",
  cost: 3,
  power: 4000,
  counter: 1000,
  trigger:
    'If your Leader has the "Revolutionary Army" type and you and your opponent have a total of 5 or less Life cards, play this card.',
  traits: ["Revolutionary Army"],
  attribute: "special",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "trigger",
        conditions: [
          {
            condition: "compound",
            operator: "and",
            conditions: [
              {
                condition: "leaderTrait",
                trait: "Revolutionary Army",
                match: "includes",
              },
              {
                condition: "totalLifeCount",
                comparison: "lte",
                value: 5,
              },
            ],
          },
        ],
        actions: [
          {
            action: "playThisCard",
          },
        ],
      },
    ],
  },
  i18n: op09Karasu100I18n,
};
