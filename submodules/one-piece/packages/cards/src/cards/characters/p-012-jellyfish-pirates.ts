import type { CharacterCard } from "@tcg/op-types";
import { pJellyfishPirates012I18n } from "./p-012-jellyfish-pirates.i18n.ts";
export const pJellyfishPirates012: CharacterCard = {
  id: "P-012",
  canonicalId: "P-012",
  slug: "jellyfish-pirates/p-012",
  name: "Jellyfish Pirates",
  printings: [
    {
      id: "P-012",
      artId: "P-012",
      setCode: "P",
      collectorNumber: "012",
      rarity: "P",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/P-012.png",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "P",
  setId: "P",
  cost: 3,
  power: 5000,
  counter: 1000,
  traits: ["FILM", "Jellyfish Pirates"],
  attribute: "special",
  i18n: pJellyfishPirates012I18n,
};
