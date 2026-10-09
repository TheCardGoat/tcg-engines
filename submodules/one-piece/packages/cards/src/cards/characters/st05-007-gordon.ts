import type { CharacterCard } from "@tcg/op-types";
import { st05Gordon007I18n } from "./st05-007-gordon.i18n.ts";

export const st05Gordon007: CharacterCard = {
  id: "ST05-007",
  canonicalId: "ST05-007",
  slug: "gordon/st05-007",
  name: "Gordon",
  printings: [
    {
      id: "ST05-007",
      artId: "ST05-007",
      setCode: "ST05",
      collectorNumber: "007",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST05-007.png",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "ST05",
  cost: 1,
  power: 3000,
  counter: 1000,
  traits: ["FILM"],
  attribute: "wisdom",
  i18n: st05Gordon007I18n,
};
