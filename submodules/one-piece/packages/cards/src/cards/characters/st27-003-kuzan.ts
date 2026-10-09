import type { CharacterCard } from "@tcg/op-types";
import { st27Kuzan003I18n } from "./st27-003-kuzan.i18n.ts";
export const st27Kuzan003: CharacterCard = {
  id: "ST27-003",
  canonicalId: "ST27-003",
  slug: "kuzan/st27-003",
  name: "Kuzan",
  printings: [
    {
      id: "ST27-003",
      artId: "ST27-003",
      setCode: "ST27",
      collectorNumber: "003",
      rarity: "SR",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST27-003.png",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "SR",
  setId: "ST27",
  cost: 6,
  traits: ["Blackbeard Pirates", "Former Navy"],
  power: 6000,
  attribute: "special",
  counter: 1000,
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.) [On K.O.] Play up to 1 {Blackbeard Pirates} type Character card with a cost of 5 or less from your trash rested.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onKo",
        actions: [
          {
            action: "play",
            source: {
              player: "self",
              zone: "trash",
            },
            count: {
              amount: 1,
              upTo: true,
            },
            filters: [
              {
                filter: "cost",
                comparison: "lte",
                value: 5,
              },
              {
                filter: "trait",
                value: "Blackbeard Pirates",
                match: "exact",
              },
              {
                filter: "cardCategory",
                value: "character",
              },
            ],
            playState: "rested",
          },
        ],
      },
    ],
  },
  i18n: st27Kuzan003I18n,
};
