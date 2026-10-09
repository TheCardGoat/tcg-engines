import type { CharacterCard } from "@tcg/op-types";
import { pBennBeckman021I18n } from "./p-021-benn-beckman.i18n.ts";
export const pBennBeckman021: CharacterCard = {
  id: "P-021",
  canonicalId: "P-021",
  slug: "benn-beckman/p-021",
  name: "Benn.Beckman",
  printings: [
    {
      id: "P-021",
      artId: "P-021",
      setCode: "P",
      collectorNumber: "021",
      rarity: "P",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/P-021.png",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "P",
  setId: "P",
  cost: 7,
  power: 9000,
  counter: 1000,
  traits: ["FILM", "Red-Haired Pirates"],
  attribute: "ranged",
  i18n: pBennBeckman021I18n,
};
