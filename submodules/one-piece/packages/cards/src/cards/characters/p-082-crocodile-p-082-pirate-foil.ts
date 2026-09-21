import type { CharacterCard } from "@tcg/op-types";
import { prb02CrocodileP082PirateFoil082I18n } from "./p-082-crocodile-p-082-pirate-foil.i18n.ts";

export const prb02CrocodileP082PirateFoil082: CharacterCard = {
  id: "P-082",
  canonicalId: "P-082",
  slug: "crocodile-p-082-pirate-foil",
  name: "Crocodile",
  printings: [
    {
      id: "P-082",
      artId: "P-082",
      setCode: "P",
      collectorNumber: "082",
      rarity: "P",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/P-082_p2.jpg",
      label: "Crocodile - P-082 (Pirate Foil)",
    },
    {
      id: "P-082_r1",
      artId: "P-082_r1",
      setCode: "P",
      collectorNumber: "082",
      rarity: "P",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/P-082_r1.jpg",
      label: "Crocodile - P-082 (Reprint)",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "P",
  setId: "P",
  cost: 5,
  power: 7000,
  traits: ["Former Baroque Works Cross Guild"],
  attribute: "special",
  effect:
    "[Your Turn] [On Play] If your Leader has the {Cross Guild} type or a type including \"Baroque Works\", place up to 1 of your opponent's Characters with 2000 power or less at the bottom of the owner's deck.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "turn",
            value: "your",
          },
          {
            condition: "compound",
            operator: "or",
            conditions: [
              {
                condition: "leaderTrait",
                trait: "Cross Guild",
                match: "includes",
              },
              {
                condition: "leaderTrait",
                trait: "Baroque Works",
                match: "includes",
              },
            ],
          },
        ],
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
                  filter: "power",
                  comparison: "lte",
                  value: 2000,
                },
              ],
            },
            position: "bottom",
          },
        ],
      },
    ],
  },
  i18n: prb02CrocodileP082PirateFoil082I18n,
};
