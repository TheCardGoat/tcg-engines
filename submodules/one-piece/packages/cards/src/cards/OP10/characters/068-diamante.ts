import type { CharacterCard } from "@tcg/op-types";
import { op10Diamante068I18n } from "./068-diamante.i18n.ts";

export const op10Diamante068: CharacterCard = {
  id: "OP10-068",
  canonicalId: "OP10-068",
  slug: "diamante/op10-068",
  name: "Diamante",
  printings: [
    {
      id: "OP10-068",
      artId: "OP10-068",
      setCode: "OP10",
      collectorNumber: "068",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP10-068.jpg",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "OP10",
  cost: 5,
  power: 7000,
  counter: 1000,
  traits: ["Donquixote Pirates"],
  attribute: "slash",
  i18n: op10Diamante068I18n,
};
