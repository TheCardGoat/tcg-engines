import type { CharacterCard } from "@tcg/op-types";
import { prb02Koby001I18n } from "./001-koby.i18n.ts";

export const prb02Koby001: CharacterCard = {
  id: "PRB02-001",
  canonicalId: "PRB02-001",
  slug: "koby/prb02-001",
  name: "Koby",
  printings: [
    {
      id: "PRB02-001",
      artId: "PRB02-001",
      setCode: "PRB02",
      collectorNumber: "001",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/PRB02-001.jpg",
    },
    {
      id: "PRB02-001_p1",
      artId: "PRB02-001_p1",
      setCode: "PRB02",
      collectorNumber: "001",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/PRB02-001_p1.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "R",
  setId: "PRB02",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Navy SWORD"],
  attribute: "strike",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/PRB02-001_p1.jpg",
      imageId: "PRB02-001_p1",
    },
  ],
  effect:
    "[Opponent's Turn] If your Leader has the \"Navy\" type, this Character gains +1000 power.[When Attacking] K.O. up to 1 of your opponent's Characters with 3000 base power or less. Then, if you have 6 or less cards in your hand, draw 1 card.",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
        actions: [
          {
            action: "ko",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "basePower",
                  comparison: "lte",
                  value: 3000,
                },
              ],
            },
          },
          {
            action: "draw",
            player: "self",
            amount: 1,
            condition: {
              condition: "handCount",
              player: "self",
              comparison: "lte",
              value: 6,
            },
          },
        ],
      },
    ],
    permanentEffects: [
      {
        conditions: [
          {
            condition: "turn",
            value: "opponent",
          },
          {
            condition: "leaderTrait",
            trait: "Navy",
            match: "includes",
          },
        ],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            value: 1000,
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: prb02Koby001I18n,
};
