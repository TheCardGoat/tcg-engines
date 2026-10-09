import type { CharacterCard } from "@tcg/op-types";
import { st02Heat011I18n } from "./st02-011-heat.i18n.ts";
export const st02Heat011: CharacterCard = {
  id: "ST02-011",
  canonicalId: "ST02-011",
  slug: "heat/st02-011",
  name: "Heat",
  printings: [
    {
      id: "ST02-011",
      artId: "ST02-011",
      setCode: "ST02",
      collectorNumber: "011",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST02-011.png",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "ST02",
  cost: 2,
  power: 4000,
  counter: 1000,
  traits: ["Kid Pirates"],
  attribute: "special",
  i18n: st02Heat011I18n,
};
