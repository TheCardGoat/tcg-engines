import type { CharacterCard } from "@tcg/op-types";
import { st26MonkeyDLuffy005I18n } from "./st26-005-monkey-d-luffy.i18n.ts";

export const st26MonkeyDLuffy005: CharacterCard = {
  id: "ST26-005",
  canonicalId: "ST26-005",
  slug: "monkey-d-luffy/st26-005",
  name: "Monkey.D.Luffy",
  printings: [
    {
      id: "ST26-005",
      artId: "ST26-005_p1",
      setCode: "ST26",
      collectorNumber: "005",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST26-005_p1.jpg",
      label: "Monkey.D.Luffy (SP)",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "SR",
  setId: "ST26",
  cost: 6,
  power: 7000,
  traits: ["Straw Hat Crew"],
  attribute: "strike",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "returnDon",
            amount: 2,
          },
        ],
        conditions: [
          {
            condition: "leaderMulticolored",
          },
          {
            condition: "donFieldCount",
            player: "opponent",
            comparison: "gte",
            value: 5,
          },
        ],
        actions: [
          {
            action: "setBasePower",
            target: {
              player: "self",
              zones: ["leader"],
              count: {
                amount: 1,
              },
              filters: [
                {
                  filter: "trait",
                  value: "Straw Hat Crew",
                  match: "includes",
                },
              ],
            },
            value: 7000,
            duration: "untilEndOfOpponentNextTurn",
          },
        ],
      },
      {
        trigger: "whenAttacking",
        costs: [
          {
            cost: "returnDon",
            amount: 2,
          },
        ],
        conditions: [
          {
            condition: "leaderMulticolored",
          },
          {
            condition: "donFieldCount",
            player: "opponent",
            comparison: "gte",
            value: 5,
          },
        ],
        actions: [
          {
            action: "setBasePower",
            target: {
              player: "self",
              zones: ["leader"],
              count: {
                amount: 1,
              },
              filters: [
                {
                  filter: "trait",
                  value: "Straw Hat Crew",
                  match: "includes",
                },
              ],
            },
            value: 7000,
            duration: "untilEndOfOpponentNextTurn",
          },
        ],
      },
    ],
  },
  i18n: st26MonkeyDLuffy005I18n,
};
