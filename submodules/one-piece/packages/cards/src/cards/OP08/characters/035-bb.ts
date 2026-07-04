import type { CharacterCard } from "@tcg/op-types";
import { op08Bb035I18n } from "./035-bb.i18n.ts";

export const op08Bb035: CharacterCard = {
  id: "OP08-035",
  canonicalId: "OP08-035",
  slug: "bb",
  name: "BB",
  printings: [
    {
      id: "OP08-035",
      artId: "OP08-035",
      setCode: "OP08",
      collectorNumber: "035",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP08-035.jpg",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "OP08",
  cost: 2,
  power: 4000,
  counter: 1000,
  traits: ["Minks"],
  attribute: "strike",
  effect: "NULL",
  i18n: op08Bb035I18n,
};
