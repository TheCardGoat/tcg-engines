import type { CharacterCard } from "@tcg/op-types";
import { eb03Ain002I18n } from "./002-ain.i18n.ts";

export const eb03Ain002: CharacterCard = {
  id: "EB03-002",
  canonicalId: "EB03-002",
  slug: "ain/eb03-002",
  name: "Ain",
  printings: [
    {
      id: "EB03-002",
      artId: "EB03-002",
      setCode: "EB03",
      collectorNumber: "002",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB03-002_4uvsBmC.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "EB03",
  cost: 5,
  power: 6000,
  counter: 2000,
  traits: ["FILM Neo Navy"],
  attribute: "special",
  i18n: eb03Ain002I18n,
};
