import type { CharacterCard } from "@tcg/op-types";
import { st30EmporioIvankov004I18n } from "./st30-004-emporio-ivankov.i18n.ts";
export const st30EmporioIvankov004: CharacterCard = {
  id: "ST30-004",
  canonicalId: "ST30-004",
  slug: "emporio-ivankov/st30-004",
  name: "Emporio.Ivankov",
  printings: [
    {
      id: "ST30-004",
      artId: "ST30-004",
      setCode: "ST30",
      collectorNumber: "004",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST30-004.png",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "ST30",
  cost: 1,
  traits: ["Impel Down", "Revolutionary Army"],
  power: 2000,
  attribute: "special",
  counter: 1000,
  effect:
    "[On Play] You may reveal 2 Character cards with 6000 power from your hand: Draw 3 cards and trash 2 cards from your hand.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 3,
          },
          {
            action: "trashFromHand",
            player: "self",
            amount: 2,
          },
        ],
        optional: true,
        costs: [
          {
            cost: "revealFromHand",
            amount: 2,
            filters: [
              {
                filter: "cardCategory",
                value: "character",
              },
              {
                filter: "power",
                comparison: "eq",
                value: 6000,
              },
            ],
          },
        ],
      },
    ],
  },
  i18n: st30EmporioIvankov004I18n,
};
