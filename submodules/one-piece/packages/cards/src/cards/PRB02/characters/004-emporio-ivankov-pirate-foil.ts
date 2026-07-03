import type { CharacterCard } from "@tcg/op-types";
import { prb02EmporioIvankovPirateFoil004I18n } from "./004-emporio-ivankov-pirate-foil.i18n.ts";

export const prb02EmporioIvankovPirateFoil004: CharacterCard = {
  id: "OP05-004",
  canonicalId: "OP05-004",
  slug: "emporio-ivankov-pirate-foil",
  name: "Emporio.Ivankov (Pirate Foil)",
  printings: [
    {
      id: "OP05-004",
      artId: "OP05-004",
      setCode: "PRB02",
      collectorNumber: "004",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-004_p1.jpg",
    },
    {
      id: "OP05-004_r1",
      artId: "OP05-004_r1",
      setCode: "PRB02",
      collectorNumber: "004",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-004_r1.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "UC",
  setId: "PRB02",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Revolutionary Army"],
  attribute: "special",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-004_r1.jpg",
      imageId: "OP05-004_r1",
    },
  ],
  effect:
    "[Activate:Main][Once Per Turn] If this Character has 7000 power or more, play up to 1 [Revolutionary Army] type Character card with 5000 power or less other than [Emporio.Ivankov] from your hand.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        conditions: [
          {
            condition: "cardState",
            target: "this",
            property: "power",
            comparison: "gte",
            value: 7000,
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
                filter: "excludeName",
                value: "Emporio.Ivankov",
              },
              {
                filter: "power",
                comparison: "lte",
                value: 5000,
              },
              {
                filter: "trait",
                value: "Revolutionary Army",
              },
              {
                filter: "cardCategory",
                value: "character",
              },
            ],
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: prb02EmporioIvankovPirateFoil004I18n,
};
