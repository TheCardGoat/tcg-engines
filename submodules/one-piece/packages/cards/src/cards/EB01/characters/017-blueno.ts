import type { CharacterCard } from "@tcg/op-types";
import { eb01Blueno017I18n } from "./017-blueno.i18n.ts";

export const eb01Blueno017: CharacterCard = {
  id: "EB01-017",
  canonicalId: "EB01-017",
  slug: "blueno/eb01-017",
  name: "Blueno",
  printings: [
    {
      id: "EB01-017",
      artId: "EB01-017",
      setCode: "EB01",
      collectorNumber: "017",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB01-017.jpg",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "EB01",
  cost: 2,
  power: 2000,
  counter: 1000,
  traits: ["FILM CP0"],
  attribute: "strike",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)",
  effects: {
    keywords: ["blocker"],
  },
  i18n: eb01Blueno017I18n,
};
