import type { CharacterCard } from "@tcg/op-types";
import { st29Franky010I18n } from "./st29-010-franky.i18n.ts";
export const st29Franky010: CharacterCard = {
  id: "ST29-010",
  canonicalId: "ST29-010",
  slug: "franky/st29-010",
  name: "Franky",
  printings: [
    {
      id: "ST29-010",
      artId: "ST29-010",
      setCode: "ST29",
      collectorNumber: "010",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST29-010.png",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "ST29",
  cost: 5,
  power: 6000,
  counter: 2000,
  traits: ["Egghead", "Straw Hat Crew"],
  attribute: "ranged",
  i18n: st29Franky010I18n,
};
