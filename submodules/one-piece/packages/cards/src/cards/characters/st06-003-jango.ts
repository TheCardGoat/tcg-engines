import type { CharacterCard } from "@tcg/op-types";
import { st06Jango003I18n } from "./st06-003-jango.i18n.ts";
export const st06Jango003: CharacterCard = {
  id: "ST06-003",
  canonicalId: "ST06-003",
  slug: "jango/st06-003",
  name: "Jango",
  printings: [
    {
      id: "ST06-003",
      artId: "ST06-003",
      setCode: "ST06",
      collectorNumber: "003",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST06-003.png",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "ST06",
  cost: 1,
  power: 3000,
  counter: 1000,
  traits: ["Navy"],
  attribute: "slash",
  i18n: st06Jango003I18n,
};
