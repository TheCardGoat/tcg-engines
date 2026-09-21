import type { CharacterCard } from "@tcg/op-types";
import { op14eb04RoronoaZoroOp14015015I18n } from "./op14-015-roronoa-zoro-op14-015.i18n.ts";

export const op14eb04RoronoaZoroOp14015015: CharacterCard = {
  id: "OP14-015",
  canonicalId: "OP14-015",
  slug: "roronoa-zoro-op14-015",
  name: "Roronoa Zoro",
  printings: [
    {
      id: "OP14-015",
      artId: "OP14-015",
      setCode: "OP14",
      collectorNumber: "015",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP14-015_witNsKK.jpg",
      label: "Roronoa Zoro - OP14-015",
    },
    {
      id: "OP14-015_p1",
      artId: "OP14-015_p1",
      setCode: "OP14",
      collectorNumber: "015",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP14-015_p1_7BUGfa9.jpg",
      label: "Roronoa Zoro - OP14-015 (Alternate Art)",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "R",
  setId: "OP14",
  cost: 7,
  power: 8000,
  traits: ["Straw Hat Crew Supernovas"],
  attribute: "slash",
  effect:
    "[Rush] (This card can attack on the turn in which it is played.) [When Attacking] Give up to 1 of your opponent's Characters −1000 power during this turn.",
  effects: {
    keywords: ["rush"],
    effects: [
      {
        trigger: "whenAttacking",
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: -1000,
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: op14eb04RoronoaZoroOp14015015I18n,
};
