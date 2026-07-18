import type { CharacterCard } from "@tcg/op-types";
import { op07FisherTiger032I18n } from "./032-fisher-tiger.i18n.ts";

export const op07FisherTiger032: CharacterCard = {
  id: "OP07-032",
  canonicalId: "OP07-032",
  slug: "fisher-tiger/op07-032",
  name: "Fisher Tiger",
  printings: [
    {
      id: "OP07-032",
      artId: "OP07-032",
      setCode: "OP07",
      collectorNumber: "032",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP07-032.jpg",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "R",
  setId: "OP07",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["Fish-Man The Sun Pirates"],
  attribute: "strike",
  effect:
    "This Character can attack Characters on the turn in which it is played. [On Play] If your Leader has the [Fish-Man] or [Merfolk] type, rest up to 1 of your opponent's Characters with a cost of 6 or less.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
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
        ],
        actions: [
          {
            action: "rest",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 6,
                },
              ],
            },
          },
        ],
      },
    ],
    permanentEffects: [
      {
        actions: [
          {
            action: "grantKeyword",
            target: {
              player: "self",
              zones: ["character"],
              count: { amount: 1 },
              self: true,
            },
            keyword: "rushCharacter",
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: op07FisherTiger032I18n,
};
