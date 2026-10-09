import type { CharacterCard } from "@tcg/op-types";
import { pNicoRobin087I18n } from "./p-087-nico-robin.i18n.ts";
export const pNicoRobin087: CharacterCard = {
  id: "P-087",
  canonicalId: "P-087",
  slug: "nico-robin/p-087",
  name: "Nico Robin",
  printings: [
    {
      id: "P-087",
      artId: "P-087",
      setCode: "P",
      collectorNumber: "087",
      rarity: "P",
      imageUrl: "https://asia-en.onepiece-cardgame.com/images/cardlist/card/P-087.png",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "P",
  setId: "P",
  power: 7000,
  traits: ["Straw Hat Crew"],
  attribute: "strike",
  cost: 5,
  counter: 1000,
  i18n: pNicoRobin087I18n,
};
