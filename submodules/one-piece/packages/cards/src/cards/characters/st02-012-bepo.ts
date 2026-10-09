import type { CharacterCard } from "@tcg/op-types";
import { st02Bepo012I18n } from "./st02-012-bepo.i18n.ts";
export const st02Bepo012: CharacterCard = {
  id: "ST02-012",
  canonicalId: "ST02-012",
  slug: "bepo/st02-012",
  name: "Bepo",
  printings: [
    {
      id: "ST02-012",
      artId: "ST02-012",
      setCode: "ST02",
      collectorNumber: "012",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST02-012.png",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "ST02",
  cost: 1,
  power: 3000,
  counter: 1000,
  traits: ["Minks", "Heart Pirates"],
  attribute: "strike",
  i18n: st02Bepo012I18n,
};
