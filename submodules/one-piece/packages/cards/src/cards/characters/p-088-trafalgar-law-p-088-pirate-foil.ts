import type { CharacterCard } from "@tcg/op-types";
import { prb02TrafalgarLawP088PirateFoil088I18n } from "./p-088-trafalgar-law-p-088-pirate-foil.i18n.ts";

export const prb02TrafalgarLawP088PirateFoil088: CharacterCard = {
  id: "P-088",
  canonicalId: "P-088",
  slug: "trafalgar-law-p-088-pirate-foil",
  name: "Trafalgar Law",
  printings: [
    {
      id: "P-088",
      artId: "P-088",
      setCode: "P",
      collectorNumber: "088",
      rarity: "P",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/P-088_p3.jpg",
      label: "Trafalgar Law - P-088 (Pirate Foil)",
    },
    {
      id: "P-088_r1",
      artId: "P-088_r1",
      setCode: "P",
      collectorNumber: "088",
      rarity: "P",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/P-088_r1.jpg",
      label: "Trafalgar Law - P-088 (Reprint)",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "P",
  setId: "P",
  cost: 4,
  power: 5000,
  counter: 2000,
  trigger:
    'If your Leader has the "Supernovas" type and you and your opponent have a total of 5 or less Life cards, play this card.Disclaimer: This card was reprinted from the original set with a different border (Note: the original print had a full art border).',
  traits: ["Heart Pirates Supernovas"],
  attribute: "slash",
  effect:
    '[Trigger] If your Leader has the "Supernovas" type and you and your opponent have a total of 5 or less Life cards, play this card.Disclaimer: This card was reprinted from the original set with a different border (Note: the original print had a full art border).',
  effects: {
    effects: [
      {
        trigger: "trigger",
        conditions: [
          {
            condition: "compound",
            operator: "and",
            conditions: [
              {
                condition: "leaderTrait",
                trait: "Supernovas",
                match: "includes",
              },
              {
                condition: "totalLifeCount",
                comparison: "lte",
                value: 5,
              },
            ],
          },
        ],
        actions: [
          {
            action: "playThisCard",
          },
        ],
      },
    ],
  },
  i18n: prb02TrafalgarLawP088PirateFoil088I18n,
};
