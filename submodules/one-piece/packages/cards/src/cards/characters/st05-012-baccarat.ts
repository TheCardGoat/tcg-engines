import type { CharacterCard } from "@tcg/op-types";
import { st05Baccarat012I18n } from "./st05-012-baccarat.i18n.ts";

export const st05Baccarat012: CharacterCard = {
  id: "ST05-012",
  canonicalId: "ST05-012",
  slug: "baccarat/st05-012",
  name: "Baccarat",
  printings: [
    {
      id: "ST05-012",
      artId: "ST05-012",
      setCode: "ST05",
      collectorNumber: "012",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST05-012.png",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "ST05",
  cost: 3,
  power: 5000,
  counter: 1000,
  traits: ["FILM", "Grantesoro"],
  attribute: "special",
  i18n: st05Baccarat012I18n,
};
