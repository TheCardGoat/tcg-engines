import type { CharacterCard } from "@tcg/op-types";
import { op04TonyTonyChopper010I18n } from "./010-tony-tony-chopper.i18n.ts";

export const op04TonyTonyChopper010: CharacterCard = {
  id: "OP04-010",
  canonicalId: "OP04-010",
  slug: "tony-tony-chopper/op04-010",
  name: "Tony Tony.Chopper",
  printings: [
    {
      id: "OP04-010",
      artId: "OP04-010",
      setCode: "OP04",
      collectorNumber: "010",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-010.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "OP04",
  cost: 3,
  power: 4000,
  counter: 1000,
  traits: ["Animal Alabasta Straw Hat Crew"],
  attribute: "strike",
  effect:
    "[On Play] Play up to 1 [Animal] type Character card with 3000 power or less from your hand.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
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
                value: 3000,
              },
              {
                filter: "trait",
                value: "Animal",
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
  i18n: op04TonyTonyChopper010I18n,
};
