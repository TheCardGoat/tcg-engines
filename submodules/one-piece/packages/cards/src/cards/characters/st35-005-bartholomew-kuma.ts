import type { CharacterCard } from "@tcg/op-types";
import { st35BartholomewKuma005I18n } from "./st35-005-bartholomew-kuma.i18n.ts";
export const st35BartholomewKuma005: CharacterCard = {
  id: "ST35-005",
  canonicalId: "ST35-005",
  slug: "bartholomew-kuma/st35-005",
  name: "Bartholomew Kuma",
  printings: [
    {
      id: "ST35-005",
      artId: "ST35-005",
      setCode: "ST35",
      collectorNumber: "005",
      rarity: "SR",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST35-005.png",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "SR",
  setId: "ST35",
  cost: 5,
  traits: ["Revolutionary Army"],
  power: 5000,
  attribute: "strike",
  counter: 1000,
  effect:
    "This Character gains +3 cost. [On Play] Give up to 1 rested DON!! card to your Leader. Then, play up to 1 Character card with 4000 power or less and the {Revolutionary Army} type from your hand or trash.",
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
            action: "modifyCost",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            value: 3,
          },
        ],
      },
    ],
  },
  i18n: st35BartholomewKuma005I18n,
};
