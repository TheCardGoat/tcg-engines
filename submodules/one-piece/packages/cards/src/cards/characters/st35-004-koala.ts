import type { CharacterCard } from "@tcg/op-types";
import { st35Koala004I18n } from "./st35-004-koala.i18n.ts";
export const st35Koala004: CharacterCard = {
  id: "ST35-004",
  canonicalId: "ST35-004",
  slug: "koala/st35-004",
  name: "Koala",
  printings: [
    {
      id: "ST35-004",
      artId: "ST35-004",
      setCode: "ST35",
      collectorNumber: "004",
      rarity: "SR",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST35-004.png",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "SR",
  setId: "ST35",
  cost: 7,
  traits: ["Dressrosa", "Revolutionary Army"],
  power: 6000,
  attribute: "strike",
  counter: 1000,
  effect:
    "This Character gains [Blocker] and +1 cost. [On Play] Give up to 1 rested DON!! card to your Leader. Then, play up to 1 Character card with 4000 power or less and the {Revolutionary Army} type from your hand or trash.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
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
          {
            action: "play",
            source: {
              player: "self",
              zone: ["hand", "trash"],
            },
            count: {
              amount: 1,
              upTo: true,
            },
            filters: [
              {
                filter: "cardCategory",
                value: "character",
              },
              {
                filter: "power",
                comparison: "lte",
                value: 4000,
              },
              {
                filter: "trait",
                value: "Revolutionary Army",
                match: "exact",
              },
            ],
          },
        ],
      },
    ],
    permanentEffects: [
      {
        actions: [
          {
            action: "grantKeyword",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            keyword: "blocker",
            duration: "permanent",
          },
          {
            action: "modifyCost",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            value: 1,
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: st35Koala004I18n,
};
