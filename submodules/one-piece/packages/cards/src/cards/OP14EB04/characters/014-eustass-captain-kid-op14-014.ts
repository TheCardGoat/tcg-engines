import type { CharacterCard } from "@tcg/op-types";
import { op14eb04EustassCaptainKidOp14014014I18n } from "./014-eustass-captain-kid-op14-014.i18n.ts";

export const op14eb04EustassCaptainKidOp14014014: CharacterCard = {
  id: "OP14-014",
  canonicalId: "OP14-014",
  slug: "eustass-captain-kid-op14-014",
  name: 'Eustass"Captain"Kid - OP14-014',
  printings: [
    {
      id: "OP14-014",
      artId: "OP14-014",
      setCode: "OP14EB04",
      collectorNumber: "014",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP14-014_mVGopmv.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "R",
  setId: "OP14EB04",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Kid Pirates Supernovas"],
  attribute: "special",
  effect:
    "[Blocker]\n[On Play] If your Leader has the {Supernovas} type, play up to 1 red Character card with 2000 power or less from your hand.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Supernovas",
            match: "includes",
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
                value: 2000,
              },
              {
                filter: "color",
                value: "red",
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
  i18n: op14eb04EustassCaptainKidOp14014014I18n,
};
