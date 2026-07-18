import type { CharacterCard } from "@tcg/op-types";
import { op12Morley093I18n } from "./093-morley.i18n.ts";

export const op12Morley093: CharacterCard = {
  id: "OP12-093",
  canonicalId: "OP12-093",
  slug: "morley/op12-093",
  name: "Morley",
  printings: [
    {
      id: "OP12-093",
      artId: "OP12-093",
      setCode: "OP12",
      collectorNumber: "093",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP12-093_V7o4OwX.jpg",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "UC",
  setId: "OP12",
  cost: 4,
  power: 5000,
  counter: 2000,
  traits: ["Giant Revolutionary Army"],
  attribute: "special",
  effect: 'If your Leader has the "Revolutionary Army" type, this Character gains +4 cost.',
  effects: {
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
          },
        ],
      },
    ],
  },
  i18n: op12Morley093I18n,
};
