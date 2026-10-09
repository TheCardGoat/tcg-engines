import type { CharacterCard } from "@tcg/op-types";
import { pSunnyKun015I18n } from "./p-015-sunny-kun.i18n.ts";
export const pSunnyKun015: CharacterCard = {
  id: "P-015",
  canonicalId: "P-015",
  slug: "sunny-kun/p-015",
  name: "Sunny-Kun",
  printings: [
    {
      id: "P-015",
      artId: "P-015",
      setCode: "P",
      collectorNumber: "015",
      rarity: "P",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/P-015.png",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "P",
  setId: "P",
  cost: 1,
  power: 3000,
  counter: 1000,
  traits: ["FILM", "Straw Hat Crew"],
  attribute: "wisdom",
  i18n: pSunnyKun015I18n,
};
