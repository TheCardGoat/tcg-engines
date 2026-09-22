import type { CharacterCard } from "@tcg/op-types";
import { st31MonkeyDLuffy004I18n } from "./st31-004-monkey-d-luffy.i18n.ts";

export const st31MonkeyDLuffy004: CharacterCard = {
  id: "ST31-004",
  canonicalId: "ST31-004",
  slug: "monkey-d-luffy/st31-004",
  name: "Monkey.D.Luffy",
  printings: [
    {
      id: "ST31-004",
      artId: "ST31-004_p1",
      setCode: "ST31",
      collectorNumber: "004",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST31-004_p1.jpg",
      label: "Monkey.D.Luffy (ST31-004) (SP)",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "SR",
  setId: "ST31",
  cost: 7,
  power: 9000,
  traits: ["Straw Hat Crew The Four Emperors"],
  attribute: "strike",
  effect:
    "If you have a total of 3 or more given DON!! cards, this Character gains [Rush]. (This card can attack on the turn in which it is played.)[On Play] For every {Straw Hat Crew} type card on your field, give up to 1 of your opponent's Characters -1000 power during this turn.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
                amountFromMatchingCards: [
                  {
                    filter: "trait",
                    value: "Straw Hat Crew",
                    match: "includes",
                  },
                ],
              },
            },
            value: -1000,
            duration: "thisTurn",
          },
        ],
      },
    ],
    permanentEffects: [
      {
        conditions: [
          {
            condition: "givenDonCount",
            player: "self",
            comparison: "gte",
            value: 3,
          },
        ],
        actions: [
          {
            action: "grantKeyword",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            keyword: "rush",
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: st31MonkeyDLuffy004I18n,
};
