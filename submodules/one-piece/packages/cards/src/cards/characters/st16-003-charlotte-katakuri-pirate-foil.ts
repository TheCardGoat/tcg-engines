import type { CharacterCard } from "@tcg/op-types";
import { prb02CharlotteKatakuriPirateFoil003I18n } from "./st16-003-charlotte-katakuri-pirate-foil.i18n.ts";

export const prb02CharlotteKatakuriPirateFoil003: CharacterCard = {
  id: "ST16-003",
  canonicalId: "ST16-003",
  slug: "charlotte-katakuri-pirate-foil",
  name: "Charlotte Katakuri",
  printings: [
    {
      id: "ST16-003",
      artId: "ST16-003",
      setCode: "ST16",
      collectorNumber: "003",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST16-003_p1.jpg",
      label: "Charlotte Katakuri (Pirate Foil)",
    },
    {
      id: "ST16-003_r1",
      artId: "ST16-003_r1",
      setCode: "ST16",
      collectorNumber: "003",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST16-003_r1.jpg",
      label: "Charlotte Katakuri (Reprint)",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "ST16",
  cost: 3,
  power: 4000,
  counter: 1000,
  traits: ["FILM Big Mom Pirates"],
  attribute: "strike",
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
