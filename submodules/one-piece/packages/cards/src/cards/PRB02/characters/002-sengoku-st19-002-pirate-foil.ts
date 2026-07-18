import type { CharacterCard } from "@tcg/op-types";
import { prb02SengokuSt19002PirateFoil002I18n } from "./002-sengoku-st19-002-pirate-foil.i18n.ts";

export const prb02SengokuSt19002PirateFoil002: CharacterCard = {
  id: "ST19-002",
  canonicalId: "ST19-002",
  slug: "sengoku-st19-002-pirate-foil",
  name: "Sengoku - ST19-002 (Pirate Foil)",
  printings: [
    {
      id: "ST19-002",
      artId: "ST19-002",
      setCode: "PRB02",
      collectorNumber: "002",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST19-002_p3.jpg",
    },
    {
      id: "ST19-002_r1",
      artId: "ST19-002_r1",
      setCode: "PRB02",
      collectorNumber: "002",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST19-002_r1.jpg",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "PRB02",
  cost: 1,
  power: 1000,
  counter: 1000,
  traits: ["Navy"],
  attribute: "wisdom",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST19-002_r1.jpg",
      imageId: "ST19-002_r1",
    },
  ],
  effect:
    '[On Play] You may trash 2 black "Navy" type cards from your hand: If your Leader has the "Navy" type, draw 3 cards.',
  effects: {
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "trashFromHand",
            amount: 2,
            filters: [
              {
                filter: "color",
                value: "black",
              },
              {
                filter: "trait",
                value: "Navy",
                match: "includes",
              },
            ],
          },
        ],
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 3,
            condition: {
              condition: "leaderTrait",
              trait: "Navy",
              match: "includes",
            },
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: prb02SengokuSt19002PirateFoil002I18n,
};
