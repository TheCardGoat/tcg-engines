import type { CharacterCard } from "@tcg/op-types";
import { pNicoRobin116I18n } from "./p-116-nico-robin.i18n.ts";
export const pNicoRobin116: CharacterCard = {
  id: "P-116",
  canonicalId: "P-116",
  slug: "nico-robin/p-116",
  name: "Nico Robin",
  printings: [
    {
      id: "P-116",
      artId: "P-116",
      setCode: "P",
      collectorNumber: "116",
      rarity: "P",
      imageUrl: "https://asia-en.onepiece-cardgame.com/images/cardlist/card/P-116.png",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "P",
  setId: "P",
  cost: 2,
  power: 1000,
  counter: 1000,
  attribute: "strike",
  traits: ["Straw Hat Crew", "Former Baroque Works"],
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.) [On K.O.] If you have 7 or more cards in your trash, draw 1 card and trash 1 card from your hand.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onKo",
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
          {
            action: "trashFromHand",
            player: "self",
            amount: 1,
          },
        ],
        conditions: [
          {
            condition: "zoneCount",
            player: "self",
            zone: "trash",
            comparison: "gte",
            value: 7,
          },
        ],
      },
    ],
  },
  i18n: pNicoRobin116I18n,
};
