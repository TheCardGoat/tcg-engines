import type { CharacterCard } from "@tcg/op-types";
import { op02JaguarDSaul109I18n } from "./109-jaguar-d-saul.i18n.ts";

export const op02JaguarDSaul109: CharacterCard = {
  id: "OP02-109",
  canonicalId: "OP02-109",
  slug: "jaguar-d-saul/op02-109",
  name: "Jaguar.D.Saul",
  printings: [
    {
      id: "OP02-109",
      artId: "OP02-109",
      setCode: "OP02",
      collectorNumber: "109",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-109.jpg",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "OP02",
  cost: 4,
  power: 6000,
  counter: 1000,
  traits: ["Giant Navy"],
  attribute: "strike",
  i18n: op02JaguarDSaul109I18n,
};
