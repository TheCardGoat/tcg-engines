import type { CharacterCard } from "@tcg/op-types";
import { op13Sanji027I18n } from "./027-sanji.i18n.ts";

export const op13Sanji027: CharacterCard = {
  id: "OP13-027",
  canonicalId: "OP13-027",
  slug: "sanji/op13-027",
  name: "Sanji",
  printings: [
    {
      id: "OP13-027",
      artId: "OP13-027",
      setCode: "OP13",
      collectorNumber: "027",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP13-027_361y5hF.jpg",
    },
    {
      id: "OP13-027_p1",
      artId: "OP13-027_p1",
      setCode: "OP13",
      collectorNumber: "027",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP13-027_p1_M0OVDMA.jpg",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "R",
  setId: "OP13",
  cost: 5,
  power: 7000,
  traits: ["FILM Straw Hat Crew"],
  attribute: "strike",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP13-027_p1_M0OVDMA.jpg",
      imageId: "OP13-027_p1",
    },
  ],
  effect:
    '[On Play] Set up to 2 of your DON!! cards as active.\n[End of Your Turn] If your Leader has the "FILM" or "Straw Hat Crew" type, set up to 1 of your DON!! cards as active.',
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "setActive",
            target: {
              player: "self",
              zones: ["costArea"],
              count: {
                amount: 2,
                upTo: true,
              },
            },
          },
        ],
      },
      {
        trigger: "endOfYourTurn",
        conditions: [
          {
            condition: "compound",
            operator: "or",
            conditions: [
              {
                condition: "leaderTrait",
                trait: "FILM",
                match: "includes",
              },
              {
                condition: "leaderTrait",
                trait: "Straw Hat Crew",
                match: "includes",
              },
            ],
          },
        ],
        actions: [
          {
            action: "setActive",
            target: {
              player: "self",
              zones: ["costArea"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
          },
        ],
      },
    ],
  },
  i18n: op13Sanji027I18n,
};
