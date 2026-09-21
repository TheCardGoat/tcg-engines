import type { CharacterCard } from "@tcg/op-types";
import { op13MonkeyDLuffy118I18n } from "./op13-118-monkey-d-luffy.i18n.ts";

export const op13MonkeyDLuffy118: CharacterCard = {
  id: "OP13-118",
  canonicalId: "OP13-118",
  slug: "monkey-d-luffy/op13-118",
  name: "Monkey.D.Luffy",
  printings: [
    {
      id: "OP13-118",
      artId: "OP13-118",
      setCode: "OP13",
      collectorNumber: "118",
      rarity: "SEC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP13-118_AZWGnsD.jpg",
      label: "Monkey.D.Luffy (118)",
    },
    {
      id: "OP13-118_p4",
      artId: "OP13-118_p4",
      setCode: "OP13",
      collectorNumber: "118",
      rarity: "SEC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP13-118_p4.jpg",
      label: "Monkey.D.Luffy (118) (Wanted Poster)",
    },
    {
      id: "OP13-118_p2",
      artId: "OP13-118_p2",
      setCode: "OP13",
      collectorNumber: "118",
      rarity: "SEC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP13-118_p2.jpg",
      label: "Monkey.D.Luffy (118) (Super Alternate Art)",
    },
    {
      id: "OP13-118_p3",
      artId: "OP13-118_p3",
      setCode: "OP13",
      collectorNumber: "118",
      rarity: "SEC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP13-118_p3.jpg",
      label: "Monkey.D.Luffy (118) (Red Super Alternate Art)",
    },
    {
      id: "OP13-118_p1",
      artId: "OP13-118_p1",
      setCode: "OP13",
      collectorNumber: "118",
      rarity: "SEC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP13-118_p1_Ly1IuQY.jpg",
      label: "Monkey.D.Luffy (118) (Parallel)",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "SEC",
  setId: "OP13",
  cost: 6,
  power: 7000,
  traits: ["Straw Hat Crew Supernovas Fish-Man Island"],
  attribute: "strike",
  effect:
    "[Double Attack]\n[On Play] If your Leader is multicolored, set up to 4 of your DON!! cards as active. Then, you cannot play Character cards with a base cost of 5 or more during this turn.",
  effects: {
    keywords: ["doubleAttack"],
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "leaderMulticolored",
          },
        ],
        actions: [
          {
            action: "setActive",
            target: {
              player: "self",
              zones: ["costArea"],
              count: {
                amount: 4,
                upTo: true,
              },
            },
          },
          {
            action: "playRestriction",
            restriction: "cannotPlay",
            filters: [
              {
                filter: "cardCategory",
                value: "character",
              },
              {
                filter: "baseCost",
                comparison: "gte",
                value: 5,
              },
            ],
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: op13MonkeyDLuffy118I18n,
};
