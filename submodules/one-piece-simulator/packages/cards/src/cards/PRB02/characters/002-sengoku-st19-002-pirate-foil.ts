import type { CharacterCard } from "@tcg/op-types";
import { prb02SengokuSt19002PirateFoil002I18n } from "./002-sengoku-st19-002-pirate-foil.i18n.ts";

export const prb02SengokuSt19002PirateFoil002: CharacterCard = {
  id: "ST19-002",
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
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Navy",
          },
        ],
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 3,
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: prb02SengokuSt19002PirateFoil002I18n,
};
