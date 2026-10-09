import type { CharacterCard } from "@tcg/op-types";
import { pBartolomeo018I18n } from "./p-018-bartolomeo.i18n.ts";
export const pBartolomeo018: CharacterCard = {
  id: "P-018",
  canonicalId: "P-018",
  slug: "bartolomeo/p-018",
  name: "Bartolomeo",
  printings: [
    {
      id: "P-018",
      artId: "P-018",
      setCode: "P",
      collectorNumber: "018",
      rarity: "P",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/P-018.png",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "P",
  setId: "P",
  cost: 2,
  power: 3000,
  traits: ["FILM", "Supernovas", "Barto Club"],
  attribute: "strike",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)",
  effects: {
    keywords: ["blocker"],
  },
  i18n: pBartolomeo018I18n,
};
