import type { CharacterCard } from "@tcg/op-types";
import { pPortgasDAce028I18n } from "./p-028-portgas-d-ace.i18n.ts";
export const pPortgasDAce028: CharacterCard = {
  id: "P-028",
  canonicalId: "P-028",
  slug: "portgas-d-ace/p-028",
  name: "Portgas.D.Ace",
  printings: [
    {
      id: "P-028",
      artId: "P-028",
      setCode: "P",
      collectorNumber: "028",
      rarity: "P",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/P-028.png",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "P",
  setId: "P",
  cost: 5,
  power: 6000,
  traits: ["Whitebeard Pirates"],
  attribute: "special",
  effect: "[Double Attack] (This card deals 2 damage.)",
  effects: {
    keywords: ["doubleAttack"],
  },
  i18n: pPortgasDAce028I18n,
};
