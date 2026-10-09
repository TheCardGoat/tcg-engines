import type { CharacterCard } from "@tcg/op-types";
import { st31Jinbe002I18n } from "./st31-002-jinbe.i18n.ts";
export const st31Jinbe002: CharacterCard = {
  id: "ST31-002",
  canonicalId: "ST31-002",
  slug: "jinbe/st31-002",
  name: "Jinbe",
  printings: [
    {
      id: "ST31-002",
      artId: "ST31-002",
      setCode: "ST31",
      collectorNumber: "002",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST31-002.png",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "ST31",
  cost: 5,
  traits: ["Fish-Man", "Straw Hat Crew"],
  power: 6000,
  counter: 1000,
  attribute: "strike",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.) [On Play] Draw 1 card and play up to 1 {Straw Hat Crew} type card with a cost of 1 from your hand.",
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
                filter: "cost",
                comparison: "eq",
                value: 1,
              },
              {
                filter: "trait",
                value: "Straw Hat Crew",
                match: "exact",
              },
            ],
          },
        ],
      },
    ],
  },
  i18n: st31Jinbe002I18n,
};
