import type { CharacterCard } from "@tcg/op-types";
import { op14eb04Bluegrass026I18n } from "./026-bluegrass.i18n.ts";

export const op14eb04Bluegrass026: CharacterCard = {
  id: "EB04-026",
  canonicalId: "EB04-026",
  slug: "bluegrass",
  name: "Bluegrass",
  printings: [
    {
      id: "EB04-026",
      artId: "EB04-026",
      setCode: "OP14EB04",
      collectorNumber: "026",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB04-026_CE6s1y3.jpg",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "OP14EB04",
  cost: 4,
  power: 6000,
  traits: ["Navy Egghead"],
  attribute: "special",
  effect:
    "[On Play] Place up to 1 of your opponent's Characters with a cost of 1 or less at the bottom of the owner's deck.\n[When Attacking] Draw 1 card and trash 1 card from your hand.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "returnToDeck",
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
                  value: 1,
                },
              ],
            },
            position: "bottom",
          },
        ],
      },
      {
        trigger: "whenAttacking",
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
          {
            action: "trashFromHand",
            player: "self",
            amount: 1,
          },
        ],
      },
    ],
  },
  i18n: op14eb04Bluegrass026I18n,
};
