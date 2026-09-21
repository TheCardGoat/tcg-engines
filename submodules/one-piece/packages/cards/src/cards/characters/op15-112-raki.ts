import type { CharacterCard } from "@tcg/op-types";
import { op15Raki112I18n } from "./op15-112-raki.i18n.ts";

export const op15Raki112: CharacterCard = {
  id: "OP15-112",
  canonicalId: "OP15-112",
  slug: "raki/op15-112",
  name: "Raki",
  printings: [
    {
      id: "OP15-112",
      artId: "OP15-112",
      setCode: "OP15",
      collectorNumber: "112",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP15-112_CpMT0lr.jpg",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "OP15",
  cost: 4,
  power: 4000,
  counter: 1000,
  traits: ["Sky Island Shandian Warrior"],
  attribute: "ranged",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)\n[On Play] Play up to 1 {Shandian Warrior} type Character card with a cost of 3 or less from your hand.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onPlay",
        actions: [
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
                filter: "cost",
                comparison: "lte",
                value: 3,
              },
              {
                filter: "trait",
                value: "Shandian Warrior",
                match: "includes",
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
  i18n: op15Raki112I18n,
};
