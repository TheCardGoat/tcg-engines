import type { CharacterCard } from "@tcg/op-types";
import { eb04Sanji052I18n } from "./eb04-052-sanji.i18n.ts";

export const eb04Sanji052: CharacterCard = {
  id: "EB04-052",
  canonicalId: "EB04-052",
  slug: "sanji/eb04-052",
  name: "Sanji",
  printings: [
    {
      id: "EB04-052",
      artId: "EB04-052",
      setCode: "EB04",
      collectorNumber: "052",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB04-052_votpJym.jpg",
      label: "Sanji (EB04-052)",
    },
    {
      id: "EB04-052_p1",
      artId: "EB04-052_p1",
      setCode: "EB04",
      collectorNumber: "052",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB04-052_p1.jpg",
      label: "Sanji (EB04-052) (Alternate Art)",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "R",
  setId: "EB04",
  cost: 4,
  power: 4000,
  counter: 1000,
  traits: ["Straw Hat Crew Egghead"],
  attribute: "strike",
  effect:
    "[When Attacking] This Character's base power becomes the same as your opponent's Leader during this turn. [On K.O.] If you have 2 or less Life cards, play up to 1 yellow Character card with 6000 power or less from your hand.",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
        actions: [
          {
            action: "setBasePowerFrom",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            source: {
              player: "opponent",
              zones: ["leader"],
              count: {
                amount: 1,
              },
            },
            duration: "thisTurn",
          },
        ],
      },
      {
        trigger: "onKo",
        conditions: [
          {
            condition: "lifeCount",
            player: "self",
            comparison: "lte",
            value: 2,
          },
        ],
        actions: [
          {
            action: "play",
            source: {
              player: "self",
              zone: "hand",
            },
            count: {
              amount: 1,
              upTo: true,
            },
            filters: [
              {
                filter: "power",
                comparison: "lte",
                value: 6000,
              },
              {
                filter: "color",
                value: "yellow",
              },
              {
                filter: "cardCategory",
                value: "character",
              },
            ],
          },
        ],
      },
    ],
  },
  i18n: eb04Sanji052I18n,
};
