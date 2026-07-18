import type { CharacterCard } from "@tcg/op-types";
import { eb02Buggy018I18n } from "./018-buggy.i18n.ts";

export const eb02Buggy018: CharacterCard = {
  id: "EB02-018",
  canonicalId: "EB02-018",
  slug: "buggy/eb02-018",
  name: "Buggy",
  printings: [
    {
      id: "EB02-018",
      artId: "EB02-018",
      setCode: "EB02",
      collectorNumber: "018",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB02-018.jpg",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "R",
  setId: "EB02",
  cost: 4,
  power: 6000,
  trigger: "Rest up to 1 of your opponent's Characters with a cost of 4 or less.",
  traits: ["Buggy Pirates East Blue"],
  attribute: "slash",
  effect:
    "[On Play] If you have no other [Buggy] Characters, up to 1 of your Leader gains [Double Attack] during this turn.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "notHasCard",
            player: "self",
            zone: "character",
            filters: [
              {
                filter: "excludeSelf",
              },
              {
                filter: "name",
                value: "Buggy",
              },
            ],
          },
        ],
        actions: [
          {
            action: "grantKeyword",
            target: {
              player: "self",
              zones: ["leader"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            keyword: "doubleAttack",
            duration: "thisTurn",
          },
        ],
      },
      {
        trigger: "trigger",
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
                  value: 4,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: eb02Buggy018I18n,
};
