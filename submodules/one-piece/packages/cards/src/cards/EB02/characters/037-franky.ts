import type { CharacterCard } from "@tcg/op-types";
import { eb02Franky037I18n } from "./037-franky.i18n.ts";

export const eb02Franky037: CharacterCard = {
  id: "EB02-037",
  canonicalId: "EB02-037",
  slug: "franky/eb02-037",
  name: "Franky",
  printings: [
    {
      id: "EB02-037",
      artId: "EB02-037",
      setCode: "EB02",
      collectorNumber: "037",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB02-037.jpg",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "R",
  setId: "EB02",
  cost: 3,
  power: 4000,
  counter: 1000,
  traits: ["Straw Hat Crew Water Seven"],
  attribute: "strike",
  effect:
    '[On Play]/[When Attacking] If your Leader has the "Straw Hat Crew" type and the number of DON!! cards on your field is equal to or less than the number on your opponent\'s field, add up to 1 DON!! card from your DON!! deck and rest it.',
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "compound",
            operator: "and",
            conditions: [
              {
                condition: "leaderTrait",
                trait: "Straw Hat Crew",
              },
              {
                condition: "donFieldComparison",
                selfComparison: "lte",
              },
            ],
          },
        ],
        actions: [
          {
            action: "addDon",
            count: {
              amount: 1,
              upTo: true,
            },
            state: "rested",
          },
        ],
      },
      {
        trigger: "whenAttacking",
        conditions: [
          {
            condition: "compound",
            operator: "and",
            conditions: [
              {
                condition: "leaderTrait",
                trait: "Straw Hat Crew",
              },
              {
                condition: "donFieldComparison",
                selfComparison: "lte",
              },
            ],
          },
        ],
        actions: [
          {
            action: "addDon",
            count: {
              amount: 1,
              upTo: true,
            },
            state: "rested",
          },
        ],
      },
    ],
  },
  i18n: eb02Franky037I18n,
};
