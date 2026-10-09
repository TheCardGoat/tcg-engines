import type { CharacterCard } from "@tcg/op-types";
import { pMonkeyDLuffy080I18n } from "./p-080-monkey-d-luffy.i18n.ts";
export const pMonkeyDLuffy080: CharacterCard = {
  id: "P-080",
  canonicalId: "P-080",
  slug: "monkey-d-luffy/p-080",
  name: "Monkey.D.Luffy",
  printings: [
    {
      id: "P-080",
      artId: "P-080",
      setCode: "P",
      collectorNumber: "080",
      rarity: "P",
      imageUrl: "https://asia-en.onepiece-cardgame.com/images/cardlist/card/P-080.png",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "P",
  setId: "P",
  power: 9000,
  traits: ["The Four Emperors", "Egghead", "Straw Hat Crew"],
  attribute: "strike",
  cost: 7,
  counter: 1000,
  i18n: pMonkeyDLuffy080I18n,
};
