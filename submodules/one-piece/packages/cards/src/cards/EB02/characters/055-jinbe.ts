import type { CharacterCard } from "@tcg/op-types";
import { eb02Jinbe055I18n } from "./055-jinbe.i18n.ts";

export const eb02Jinbe055: CharacterCard = {
  id: "EB02-055",
  canonicalId: "EB02-055",
  slug: "jinbe/eb02-055",
  name: "Jinbe",
  printings: [
    {
      id: "EB02-055",
      artId: "EB02-055",
      setCode: "EB02",
      collectorNumber: "055",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB02-055.jpg",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "R",
  setId: "EB02",
  cost: 4,
  power: 5000,
  counter: 2000,
  trigger:
    'If your Leader has the "Fish-Man" or "Merfolk" type and you have 2 or less Life cards, play this card.',
  traits: ["Fish-Man Straw Hat Crew"],
  attribute: "strike",
  effect:
    '[Trigger] If your Leader has the "Fish-Man" or "Merfolk" type and you have 2 or less Life cards, play this card.',
  effects: {
    effects: [
      {
        trigger: "trigger",
        conditions: [
          {
            condition: "compound",
            operator: "or",
            conditions: [
              {
                condition: "leaderTrait",
                trait: "Fish-Man",
                match: "includes",
              },
              {
                condition: "leaderTrait",
                trait: "Merfolk",
                match: "includes",
              },
            ],
          },
          {
            condition: "lifeCount",
            player: "self",
            comparison: "lte",
            value: 2,
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
  i18n: eb02Jinbe055I18n,
};
