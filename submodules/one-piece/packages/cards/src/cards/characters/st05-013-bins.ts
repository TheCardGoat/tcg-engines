import type { CharacterCard } from "@tcg/op-types";
import { st05Bins013I18n } from "./st05-013-bins.i18n.ts";

export const st05Bins013: CharacterCard = {
  id: "ST05-013",
  canonicalId: "ST05-013",
  slug: "bins/st05-013",
  name: "Bins",
  printings: [
    {
      id: "ST05-013",
      artId: "ST05-013",
      setCode: "ST05",
      collectorNumber: "013",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST05-013.png",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "ST05",
  cost: 4,
  power: 6000,
  counter: 1000,
  traits: ["FILM", "Neo Navy"],
  attribute: "special",
  i18n: st05Bins013I18n,
};
