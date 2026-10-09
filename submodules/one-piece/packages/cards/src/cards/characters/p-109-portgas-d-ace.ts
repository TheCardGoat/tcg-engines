import type { CharacterCard } from "@tcg/op-types";
import { pPortgasDAce109I18n } from "./p-109-portgas-d-ace.i18n.ts";
export const pPortgasDAce109: CharacterCard = {
  id: "P-109",
  canonicalId: "P-109",
  slug: "portgas-d-ace/p-109",
  name: "Portgas.D.Ace",
  printings: [
    {
      id: "P-109",
      artId: "P-109",
      setCode: "P",
      collectorNumber: "109",
      rarity: "P",
      imageUrl: "https://asia-en.onepiece-cardgame.com/images/cardlist/card/P-109.png",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "P",
  setId: "P",
  cost: 5,
  power: 6000,
  counter: 1000,
  attribute: "special",
  traits: ["Whitebeard Pirates"],
  effect:
    "[Blocker] [On Play] Look at 3 cards from the top of your deck and place them at the top or bottom of your deck in any order. Then, give up to 1 rested DON!! card to your Leader or 1 of your Characters.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "rearrangeDeck",
            player: "self",
            count: 3,
            position: "topOrBottom",
          },
          {
            action: "giveDon",
            target: {
              player: "self",
              zones: ["leader", "character"],
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
  i18n: pPortgasDAce109I18n,
};
