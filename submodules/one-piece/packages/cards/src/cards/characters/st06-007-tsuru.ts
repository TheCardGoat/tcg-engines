import type { CharacterCard } from "@tcg/op-types";
import { st06Tsuru007I18n } from "./st06-007-tsuru.i18n.ts";
export const st06Tsuru007: CharacterCard = {
  id: "ST06-007",
  canonicalId: "ST06-007",
  slug: "tsuru/st06-007",
  name: "Tsuru",
  printings: [
    {
      id: "ST06-007",
      artId: "ST06-007",
      setCode: "ST06",
      collectorNumber: "007",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST06-007.png",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "ST06",
  cost: 2,
  power: 2000,
  counter: 1000,
  traits: ["Navy"],
  attribute: "wisdom",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)",
  effects: {
    keywords: ["blocker"],
  },
  i18n: st06Tsuru007I18n,
};
