import type { CharacterCard } from "@tcg/op-types";
import { eb03UtaSp003I18n } from "./eb03-003-uta-sp.i18n.ts";

export const eb03UtaSp003: CharacterCard = {
  id: "EB03-003",
  canonicalId: "EB03-003",
  slug: "uta-sp/eb03-003",
  name: "Uta",
  printings: [
    {
      id: "EB03-003",
      artId: "EB03-003",
      setCode: "EB03",
      collectorNumber: "003",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB03-003_a1HWpXc.jpg",
      label: "Uta (003)",
    },
    {
      id: "EB03-003_p1",
      artId: "EB03-003_p1",
      setCode: "EB03",
      collectorNumber: "003",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB03-003_p1_viX3Rl8.jpg",
      label: "Uta (003) (Alternate Art)",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "SR",
  setId: "EB03",
  cost: 5,
  power: 7000,
  traits: ["FILM"],
  attribute: "special",
  effect:
    "[On Play] If your Leader is [Uta], draw 2 cards. Then, play up to 1 Character card with 6000 power or less and no base effect from your hand.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 2,
            condition: {
              condition: "leaderName",
              name: "Uta",
            },
          },
          {
            action: "play",
            source: {
              player: "self",
              zone: "hand",
            },
            count: {
              amount: 1,
              upTo: true,
            },
            filters: [
              {
                filter: "noBaseEffect",
              },
              {
                filter: "power",
                comparison: "lte",
                value: 6000,
              },
              {
                filter: "cardCategory",
                value: "character",
              },
            ],
          },
        ],
      },
    ],
  },
  i18n: eb03UtaSp003I18n,
};
