import type { CharacterCard } from "@tcg/op-types";
import { st24CaponeGangBege001I18n } from "./st24-001-capone-gang-bege.i18n.ts";
export const st24CaponeGangBege001: CharacterCard = {
  id: "ST24-001",
  canonicalId: "ST24-001",
  slug: "capone-gang-bege/st24-001",
  name: 'Capone"Gang"Bege',
  printings: [
    {
      id: "ST24-001",
      artId: "ST24-001",
      setCode: "ST24",
      collectorNumber: "001",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST24-001.png",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "ST24",
  cost: 2,
  traits: ["Supernovas", "Firetank Pirates"],
  power: 1000,
  attribute: "ranged",
  counter: 1000,
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.) [On Play] If you have 6 or more rested cards, draw 1 card and trash 1 card from your hand.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "restedCardCount",
            player: "self",
            comparison: "gte",
            value: 6,
          },
        ],
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
      },
    ],
  },
  i18n: st24CaponeGangBege001I18n,
};
