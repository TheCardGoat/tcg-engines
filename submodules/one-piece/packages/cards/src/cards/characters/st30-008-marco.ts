import type { CharacterCard } from "@tcg/op-types";
import { st30Marco008I18n } from "./st30-008-marco.i18n.ts";
export const st30Marco008: CharacterCard = {
  id: "ST30-008",
  canonicalId: "ST30-008",
  slug: "marco/st30-008",
  name: "Marco",
  printings: [
    {
      id: "ST30-008",
      artId: "ST30-008",
      setCode: "ST30",
      collectorNumber: "008",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST30-008.png",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "ST30",
  cost: 5,
  traits: ["Whitebeard Pirates"],
  power: 6000,
  attribute: "special",
  counter: 1000,
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.) [On K.O.] You may trash 1 Character card with 6000 power from your hand: Play this Character card from your trash rested.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onKo",
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
            filters: [
              {
                filter: "cardCategory",
                value: "character",
              },
              {
                filter: "power",
                comparison: "eq",
                value: 6000,
              },
            ],
          },
        ],
        actions: [
          {
            action: "play",
            source: {
              player: "self",
              zone: "trash",
            },
            count: {
              amount: 1,
            },
            self: true,
            playState: "rested",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: st30Marco008I18n,
};
