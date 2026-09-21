import type { CharacterCard } from "@tcg/op-types";
import { pSabo105I18n } from "./p-105-sabo.i18n.ts";

export const pSabo105: CharacterCard = {
  id: "P-105",
  canonicalId: "P-105",
  slug: "sabo/p-105",
  name: "Sabo",
  printings: [
    {
      id: "P-105",
      artId: "P-105_p1",
      setCode: "P",
      collectorNumber: "105",
      rarity: "P",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/P-105_p1.jpg",
      label: "Sabo (P-105) (SP)",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "P",
  setId: "P",
  cost: 4,
  power: 6000,
  traits: ["Revolutionary Army"],
  attribute: "special",
  effect:
    "If your Leader has the {Revolutionary Army} type, this Character gains [Blocker] and +4 cost.[On Play] You may add 1 card from the top or bottom of your Life cards to your hand: Give up to 1 rested DON!! card to your Leader or 1 of your Characters.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "addLifeToHand",
            amount: 1,
            position: "choice",
          },
        ],
        actions: [
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
        optional: true,
      },
    ],
    permanentEffects: [
      {
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Revolutionary Army",
            match: "includes",
          },
        ],
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
            value: 4,
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: pSabo105I18n,
};
