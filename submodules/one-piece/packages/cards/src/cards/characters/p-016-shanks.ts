import type { CharacterCard } from "@tcg/op-types";
import { pShanks016I18n } from "./p-016-shanks.i18n.ts";
export const pShanks016: CharacterCard = {
  id: "P-016",
  canonicalId: "P-016",
  slug: "shanks/p-016",
  name: "Shanks",
  printings: [
    {
      id: "P-016",
      artId: "P-016",
      setCode: "P",
      collectorNumber: "016",
      rarity: "P",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/P-016.png",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "P",
  setId: "P",
  cost: 8,
  power: 10000,
  counter: 1000,
  traits: ["FILM", "The Four Emperors", "Red-Haired Pirates"],
  attribute: "slash",
  i18n: pShanks016I18n,
};
