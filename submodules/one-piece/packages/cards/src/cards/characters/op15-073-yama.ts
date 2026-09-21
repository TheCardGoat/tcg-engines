import type { CharacterCard } from "@tcg/op-types";
import { op15Yama073I18n } from "./op15-073-yama.i18n.ts";

export const op15Yama073: CharacterCard = {
  id: "OP15-073",
  canonicalId: "OP15-073",
  slug: "yama/op15-073",
  name: "Yama",
  printings: [
    {
      id: "OP15-073",
      artId: "OP15-073",
      setCode: "OP15",
      collectorNumber: "073",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP15-073_A4zP3BK.jpg",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "OP15",
  cost: 3,
  power: 4000,
  counter: 1000,
  traits: ["Sky Island"],
  attribute: "slash",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)\n[On Play] Play up to 1 [Heavenly Warriors] with a cost of 1 or up to 1 {Vassals} type Character card with a cost of 1 from your hand.",
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
                comparison: "eq",
                value: 1,
              },
              {
                filter: "name",
                value: "Heavenly Warriors",
              },
            ],
          },
        ],
      },
    ],
  },
  i18n: op15Yama073I18n,
};
