import type { CharacterCard } from "@tcg/op-types";
import { prb02CharlotteKatakuriPirateFoil003I18n } from "./003-charlotte-katakuri-pirate-foil.i18n.ts";

export const prb02CharlotteKatakuriPirateFoil003: CharacterCard = {
  id: "ST16-003",
  canonicalId: "ST16-003",
  slug: "charlotte-katakuri-pirate-foil",
  name: "Charlotte Katakuri (Pirate Foil)",
  printings: [
    {
      id: "ST16-003",
      artId: "ST16-003",
      setCode: "PRB02",
      collectorNumber: "003",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST16-003_p1.jpg",
    },
    {
      id: "ST16-003_r1",
      artId: "ST16-003_r1",
      setCode: "PRB02",
      collectorNumber: "003",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST16-003_r1.jpg",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "PRB02",
  cost: 3,
  power: 4000,
  counter: 1000,
  traits: ["FILM Big Mom Pirates"],
  attribute: "strike",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST16-003_r1.jpg",
      imageId: "ST16-003_r1",
    },
  ],
  effect:
    'If your Leader has the "FILM" type and you have 6 or more rested cards, this Character gains +2000 power.',
  effects: {
    permanentEffects: [
      {
        conditions: [
          {
            condition: "compound",
            operator: "and",
            conditions: [
              {
                condition: "leaderTrait",
                trait: "FILM",
                match: "includes",
              },
              {
                condition: "restedCardCount",
                player: "self",
                comparison: "gte",
                value: 6,
              },
            ],
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
            value: 2000,
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: prb02CharlotteKatakuriPirateFoil003I18n,
};
