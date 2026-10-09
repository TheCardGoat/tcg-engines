import type { CharacterCard } from "@tcg/op-types";
import { st04BlackMaria011I18n } from "./st04-011-black-maria.i18n.ts";

export const st04BlackMaria011: CharacterCard = {
  id: "ST04-011",
  canonicalId: "ST04-011",
  slug: "black-maria/st04-011",
  name: "Black Maria",
  printings: [
    {
      id: "ST04-011",
      artId: "ST04-011",
      setCode: "ST04",
      collectorNumber: "011",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST04-011.png",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "ST04",
  cost: 2,
  traits: ["Animal Kingdom Pirates"],
  power: 2000,
  attribute: "special",
  counter: 1000,
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)",
  effects: {
    keywords: ["blocker"],
  },
  i18n: st04BlackMaria011I18n,
};
