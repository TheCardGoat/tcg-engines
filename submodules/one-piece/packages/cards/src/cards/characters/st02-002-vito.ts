import type { CharacterCard } from "@tcg/op-types";
import { st02Vito002I18n } from "./st02-002-vito.i18n.ts";
export const st02Vito002: CharacterCard = {
  id: "ST02-002",
  canonicalId: "ST02-002",
  slug: "vito/st02-002",
  name: "Vito",
  printings: [
    {
      id: "ST02-002",
      artId: "ST02-002",
      setCode: "ST02",
      collectorNumber: "002",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST02-002.png",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "ST02",
  cost: 3,
  power: 5000,
  counter: 1000,
  traits: ["Firetank Pirates"],
  attribute: "ranged",
  i18n: st02Vito002I18n,
};
