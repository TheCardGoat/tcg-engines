import type { CharacterCard } from "@tcg/op-types";
import { pPortgasDAce103I18n } from "./p-103-portgas-d-ace.i18n.ts";
export const pPortgasDAce103: CharacterCard = {
  id: "P-103",
  canonicalId: "P-103",
  slug: "portgas-d-ace/p-103",
  name: "Portgas.D.Ace",
  printings: [
    {
      id: "P-103",
      artId: "P-103",
      setCode: "P",
      collectorNumber: "103",
      rarity: "P",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/P-103.png",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "P",
  setId: "P",
  cost: 4,
  power: 6000,
  traits: ["Whitebeard Pirates"],
  attribute: "special",
  effect:
    "[On Play] Draw 2 cards and place 2 cards from your hand at the top or bottom of your deck in any order. Then, give up to 1 rested DON!! card to your Leader.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 2,
          },
          {
            action: "returnToDeck",
            target: {
              player: "self",
              zones: ["hand"],
              count: {
                amount: 2,
              },
            },
            position: "any",
            order: "any",
          },
          {
            action: "giveDon",
            target: {
              player: "self",
              zones: ["leader"],
              count: {
                amount: 1,
              },
            },
            count: {
              amount: 1,
              upTo: true,
            },
            donState: "rested",
          },
        ],
      },
    ],
  },
  i18n: pPortgasDAce103I18n,
};
