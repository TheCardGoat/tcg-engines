import type { CharacterCard } from "@tcg/op-types";
import { st29Brook011I18n } from "./st29-011-brook.i18n.ts";
export const st29Brook011: CharacterCard = {
  id: "ST29-011",
  canonicalId: "ST29-011",
  slug: "brook/st29-011",
  name: "Brook",
  printings: [
    {
      id: "ST29-011",
      artId: "ST29-011",
      setCode: "ST29",
      collectorNumber: "011",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST29-011.png",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "ST29",
  cost: 2,
  power: 2000,
  counter: 1000,
  traits: ["Egghead", "Straw Hat Crew"],
  attribute: "slash",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)",
  effects: {
    keywords: ["blocker"],
  },
  i18n: st29Brook011I18n,
};
