import type { CharacterCard } from "@tcg/op-types";
import { eb04BartholomewKuma055I18n } from "./eb04-055-bartholomew-kuma.i18n.ts";

export const eb04BartholomewKuma055: CharacterCard = {
  id: "EB04-055",
  canonicalId: "EB04-055",
  slug: "bartholomew-kuma/eb04-055",
  name: "Bartholomew Kuma",
  printings: [
    {
      id: "EB04-055",
      artId: "EB04-055",
      setCode: "EB04",
      collectorNumber: "055",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB04-055_l4zmFkO.jpg",
      label: "Bartholomew Kuma (EB04-055)",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "EB04",
  cost: 4,
  power: 5000,
  counter: 1000,
  trigger:
    "If your Leader has the {Revolutionary Army} type and you and your opponent have a total of 5 or less Life cards, play this card.",
  traits: ["Revolutionary Army The Seven Warlords of the Sea"],
  attribute: "strike",
  effect:
    "[On K.O.] Play up to 1 {Revolutionary Army} type Character card with a cost of 4 or less from your hand.",
  effects: {
    effects: [
      {
        trigger: "onKo",
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
                filter: "cost",
                comparison: "lte",
                value: 4,
              },
              {
                filter: "trait",
                value: "Revolutionary Army",
                match: "includes",
              },
              {
                filter: "cardCategory",
                value: "character",
              },
            ],
          },
        ],
      },
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
  i18n: eb04BartholomewKuma055I18n,
};
