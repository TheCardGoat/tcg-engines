import type { CharacterCard } from "@tcg/op-types";
import { eb04RosinanteLaw038I18n } from "./eb04-038-rosinante-law.i18n.ts";

export const eb04RosinanteLaw038: CharacterCard = {
  id: "EB04-038",
  canonicalId: "EB04-038",
  slug: "rosinante-law/eb04-038",
  name: "Rosinante & Law",
  printings: [
    {
      id: "EB04-038",
      artId: "EB04-038",
      setCode: "EB04",
      collectorNumber: "038",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB04-038_kpirl1P.jpg",
    },
    {
      id: "EB04-038_p1",
      artId: "EB04-038_p1",
      setCode: "EB04",
      collectorNumber: "038",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB04-038_p1_Yocax12.jpg",
      label: "Rosinante & Law (Alternate Art)",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "SR",
  setId: "EB04",
  cost: 6,
  power: 8000,
  traits: ["Donquixote Pirates Navy"],
  attribute: ["special", "wisdom"],
  effect:
    "Under the rules of this game, also treat this card's name as [Trafalgar Law] and [Donquixote Rosinante]. [Blocker] [On Play] If the number of DON!! cards on your field is equal to or less than the number on your opponent's field, draw 1 card. Then, add up to 1 DON!! card from your DON!! deck and set it as active.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
            condition: {
              condition: "donFieldComparison",
              selfComparison: "lte",
            },
          },
          {
            action: "addDon",
            count: {
              amount: 1,
              upTo: true,
            },
            state: "active",
          },
        ],
      },
    ],
  },
  i18n: eb04RosinanteLaw038I18n,
};
