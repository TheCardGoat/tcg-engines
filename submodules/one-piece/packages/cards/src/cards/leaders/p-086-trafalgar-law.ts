import type { LeaderCard } from "@tcg/op-types";
import { pTrafalgarLaw086I18n } from "./p-086-trafalgar-law.i18n.ts";
export const pTrafalgarLaw086: LeaderCard = {
  id: "P-086",
  canonicalId: "P-086",
  slug: "trafalgar-law/p-086",
  name: "Trafalgar Law",
  printings: [
    {
      id: "P-086",
      artId: "P-086",
      setCode: "P",
      collectorNumber: "086",
      rarity: "P",
      imageUrl: "https://asia-en.onepiece-cardgame.com/images/cardlist/card/P-086.png",
    },
  ],
  cardType: "leader",
  color: ["red", "purple"],
  rarity: "P",
  setId: "P",
  power: 5000,
  traits: ["Heart Pirates"],
  attribute: "slash",
  life: 4,
  effect:
    "[Activate: Main] [Once Per Turn] DON!! −3, You may place 1 Character with 3000 power or more at the bottom of your deck: Play up to 1 {Heart Pirates} type Character card with a cost of 4 or less from your hand.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        oncePerTurn: true,
        optional: true,
        costs: [
          {
            cost: "returnDon",
            amount: 3,
          },
          {
            cost: "returnCharacterToDeck",
            amount: 1,
            position: "bottom",
            player: "self",
            filters: [
              {
                filter: "power",
                comparison: "gte",
                value: 3000,
              },
            ],
          },
        ],
        actions: [
          {
            action: "play",
            source: {
              player: "self",
              zone: "hand",
            },
            count: {
              amount: 1,
              upTo: true,
            },
            filters: [
              {
                filter: "trait",
                value: "Heart Pirates",
                match: "exact",
              },
              {
                filter: "cardCategory",
                value: "character",
              },
              {
                filter: "cost",
                comparison: "lte",
                value: 4,
              },
            ],
          },
        ],
      },
    ],
  },
  i18n: pTrafalgarLaw086I18n,
};
