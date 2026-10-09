import type { CharacterCard } from "@tcg/op-types";
import { st05DrIndigo015I18n } from "./st05-015-dr-indigo.i18n.ts";

export const st05DrIndigo015: CharacterCard = {
  id: "ST05-015",
  canonicalId: "ST05-015",
  slug: "dr-indigo/st05-015",
  name: "Dr. Indigo",
  printings: [
    {
      id: "ST05-015",
      artId: "ST05-015",
      setCode: "ST05",
      collectorNumber: "015",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST05-015.png",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "ST05",
  cost: 2,
  power: 4000,
  counter: 1000,
  traits: ["FILM", "Scientist", "Golden Lion Pirates"],
  attribute: "wisdom",
  i18n: st05DrIndigo015I18n,
};
