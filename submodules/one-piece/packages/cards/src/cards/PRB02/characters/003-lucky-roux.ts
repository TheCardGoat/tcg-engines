import type { CharacterCard } from "@tcg/op-types";
import { prb02LuckyRoux003I18n } from "./003-lucky-roux.i18n.ts";

export const prb02LuckyRoux003: CharacterCard = {
  id: "PRB02-003",
  canonicalId: "PRB02-003",
  slug: "lucky-roux/prb02-003",
  name: "Lucky.Roux",
  printings: [
    {
      id: "PRB02-003",
      artId: "PRB02-003",
      setCode: "PRB02",
      collectorNumber: "003",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/PRB02-003.jpg",
    },
    {
      id: "PRB02-003_p1",
      artId: "PRB02-003_p1",
      setCode: "PRB02",
      collectorNumber: "003",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/PRB02-003_p1.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "R",
  setId: "PRB02",
  cost: 4,
  power: 2000,
  counter: 1000,
  traits: ["Red-Haired Pirates"],
  attribute: "ranged",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/PRB02-003_p1.jpg",
      imageId: "PRB02-003_p1",
    },
  ],
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)[On Play] You may trash 1 Character card with 6000 power or more from your hand: Draw 2 cards.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
            filters: [
              {
                filter: "cardCategory",
                value: "character",
              },
              {
                filter: "power",
                comparison: "gte",
                value: 6000,
              },
            ],
          },
        ],
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 2,
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: prb02LuckyRoux003I18n,
};
