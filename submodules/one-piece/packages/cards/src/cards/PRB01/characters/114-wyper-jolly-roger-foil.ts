import type { CharacterCard } from "@tcg/op-types";
import { prb01WyperJollyRogerFoil114I18n } from "./114-wyper-jolly-roger-foil.i18n.ts";

export const prb01WyperJollyRogerFoil114: CharacterCard = {
  id: "OP06-114",
  canonicalId: "OP06-114",
  slug: "wyper-jolly-roger-foil",
  name: "Wyper (Jolly Roger Foil)",
  printings: [
    {
      id: "OP06-114",
      artId: "OP06-114",
      setCode: "PRB01",
      collectorNumber: "114",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-114_p2.jpg",
    },
    {
      id: "OP06-114_p3",
      artId: "OP06-114_p3",
      setCode: "PRB01",
      collectorNumber: "114",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-114_p3.jpg",
    },
    {
      id: "OP06-114_r1",
      artId: "OP06-114_r1",
      setCode: "PRB01",
      collectorNumber: "114",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-114_r1.png",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "UC",
  setId: "PRB01",
  cost: 5,
  power: 7000,
  traits: ["Sky Island Shandian Warrior"],
  attribute: "ranged",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-114_p3.jpg",
      imageId: "OP06-114_p3",
    },
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-114_r1.png",
      imageId: "OP06-114_r1",
    },
  ],
  effect:
    "[On Play] You may place 1 Stage with a cost of 1 at the bottom of the owner's deck: Look at 5 cards from the top of your deck; reveal up to 1 [Upper Yard] or [Shandian Warrior] type card and add it to your hand. Then, place the rest at the bottom of your deck in any order.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "search",
            lookCount: 5,
            source: {
              player: "self",
              zone: "deck",
            },
            revealCount: {
              amount: 1,
              upTo: true,
            },
            revealFilters: [
              {
                filter: "trait",
                value: "Upper Yard",
              },
              {
                filter: "trait",
                value: "Shandian Warrior",
              },
            ],
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: prb01WyperJollyRogerFoil114I18n,
};
