import type { CharacterCard } from "@tcg/op-types";
import { pRoronoaZoro045I18n } from "./p-045-roronoa-zoro.i18n.ts";
export const pRoronoaZoro045: CharacterCard = {
  id: "P-045",
  canonicalId: "P-045",
  slug: "roronoa-zoro/p-045",
  name: "Roronoa Zoro",
  printings: [
    {
      id: "P-045",
      artId: "P-045",
      setCode: "P",
      collectorNumber: "045",
      rarity: "P",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/P-045.png",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "P",
  setId: "P",
  cost: 6,
  traits: ["Straw Hat Crew"],
  power: 7000,
  attribute: "slash",
  counter: 1000,
  effect:
    "[Banish] (When this card deals damage, the target card is trashed without activating its Trigger.)",
  effects: {
    keywords: ["banish"],
  },
  i18n: pRoronoaZoro045I18n,
};
