import type { CharacterCard } from "@tcg/op-types";
import { prb02SengokuSt19002PirateFoil002I18n } from "./st19-002-sengoku-st19-002-pirate-foil.i18n.ts";

export const prb02SengokuSt19002PirateFoil002: CharacterCard = {
  id: "ST19-002",
  canonicalId: "ST19-002",
  slug: "sengoku-st19-002-pirate-foil",
  name: "Sengoku",
  printings: [
    {
      id: "ST19-002",
      artId: "ST19-002",
      setCode: "ST19",
      collectorNumber: "002",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST19-002_p3.jpg",
      label: "Sengoku - ST19-002 (Pirate Foil)",
    },
    {
      id: "ST19-002_r1",
      artId: "ST19-002_r1",
      setCode: "ST19",
      collectorNumber: "002",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST19-002_r1.jpg",
      label: "Sengoku - ST19-002 (Reprint)",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "ST19",
  cost: 1,
  power: 1000,
  counter: 1000,
  traits: ["Navy"],
  attribute: "wisdom",
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
