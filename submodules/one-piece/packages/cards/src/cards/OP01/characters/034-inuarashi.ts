import type { CharacterCard } from "@tcg/op-types";
import { op01Inuarashi034I18n } from "./034-inuarashi.i18n.ts";

export const op01Inuarashi034: CharacterCard = {
  id: "OP01-034",
  canonicalId: "OP01-034",
  slug: "inuarashi/op01-034",
  name: "Inuarashi",
  printings: [
    {
      id: "OP01-034",
      artId: "OP01-034",
      setCode: "OP01",
      collectorNumber: "034",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-034.jpg",
    },
    {
      id: "OP01-034_p1",
      artId: "OP01-034_p1",
      setCode: "OP01",
      collectorNumber: "034",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-034_p1.jpg",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "OP01",
  cost: 3,
  power: 4000,
  counter: 1000,
  traits: ["Former Whitebeard Pirates Land of Wano Minks The Akazaya Nine"],
  attribute: "slash",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-034_p1.jpg",
      imageId: "OP01-034_p1",
    },
  ],
  effect:
    "[DON!! x2] [When Attacking] Set up to 1 of your DON!! cards as active.  This card has been officially errata'd.",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
        conditions: [
          {
            condition: "donAttached",
            amount: 2,
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
  i18n: op01Inuarashi034I18n,
};
