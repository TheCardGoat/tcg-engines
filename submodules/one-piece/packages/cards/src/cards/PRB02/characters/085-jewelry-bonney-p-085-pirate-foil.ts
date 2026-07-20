import type { CharacterCard } from "@tcg/op-types";
import { prb02JewelryBonneyP085PirateFoil085I18n } from "./085-jewelry-bonney-p-085-pirate-foil.i18n.ts";

export const prb02JewelryBonneyP085PirateFoil085: CharacterCard = {
  id: "P-085",
  canonicalId: "P-085",
  slug: "jewelry-bonney-p-085-pirate-foil",
  name: "Jewelry Bonney - P-085 (Pirate Foil)",
  printings: [
    {
      id: "P-085",
      artId: "P-085",
      setCode: "PRB02",
      collectorNumber: "085",
      rarity: "P",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/P-085_p3.jpg",
    },
    {
      id: "P-085_r1",
      artId: "P-085_r1",
      setCode: "PRB02",
      collectorNumber: "085",
      rarity: "P",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/P-085_r1.jpg",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "P",
  setId: "PRB02",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["Bonney Pirates Supernovas"],
  attribute: "special",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/P-085_r1.jpg",
      imageId: "P-085_r1",
    },
  ],
  effect:
    "[On Play] If your Leader has the \"Supernovas\" type and the number of your Life cards is equal to or less than the number of your opponent's Life cards, add up to 1 of your opponent's Characters with a cost of 4 or less to the top or bottom of the owner's Life cards face-up.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "compound",
            operator: "and",
            conditions: [
              {
                condition: "leaderTrait",
                trait: "Supernovas",
                match: "includes",
              },
              {
                condition: "lifeComparison",
                selfComparison: "lte",
              },
            ],
          },
        ],
        actions: [
          {
            action: "addToLife",
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
            position: "choice",
            faceUp: true,
          },
        ],
      },
    ],
  },
  i18n: prb02JewelryBonneyP085PirateFoil085I18n,
};
