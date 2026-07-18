import type { CharacterCard } from "@tcg/op-types";
import { op04Sanji007I18n } from "./007-sanji.i18n.ts";

export const op04Sanji007: CharacterCard = {
  id: "OP04-007",
  canonicalId: "OP04-007",
  slug: "sanji/op04-007",
  name: "Sanji",
  printings: [
    {
      id: "OP04-007",
      artId: "OP04-007",
      setCode: "OP04",
      collectorNumber: "007",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-007.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "OP04",
  cost: 1,
  power: 3000,
  counter: 1000,
  traits: ["Alabasta Straw Hat Crew"],
  attribute: "strike",
  i18n: op04Sanji007I18n,
};
