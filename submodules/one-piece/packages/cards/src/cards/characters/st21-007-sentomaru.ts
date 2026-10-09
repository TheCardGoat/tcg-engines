import type { CharacterCard } from "@tcg/op-types";
import { st21Sentomaru007I18n } from "./st21-007-sentomaru.i18n.ts";
export const st21Sentomaru007: CharacterCard = {
  id: "ST21-007",
  canonicalId: "ST21-007",
  slug: "sentomaru/st21-007",
  name: "Sentomaru",
  printings: [
    {
      id: "ST21-007",
      artId: "ST21-007",
      setCode: "ST21",
      collectorNumber: "007",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST21-007.png",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "ST21",
  cost: 2,
  traits: ["Egghead", "Navy"],
  power: 2000,
  attribute: "slash",
  counter: 1000,
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)",
  effects: {
    keywords: ["blocker"],
  },
  i18n: st21Sentomaru007I18n,
};
