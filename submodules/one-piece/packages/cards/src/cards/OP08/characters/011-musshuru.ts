import type { CharacterCard } from "@tcg/op-types";
import { op08Musshuru011I18n } from "./011-musshuru.i18n.ts";

export const op08Musshuru011: CharacterCard = {
  id: "OP08-011",
  canonicalId: "OP08-011",
  slug: "musshuru",
  name: "Musshuru",
  printings: [
    {
      id: "OP08-011",
      artId: "OP08-011",
      setCode: "OP08",
      collectorNumber: "011",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP08-011.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "OP08",
  cost: 6,
  power: 8000,
  counter: 1000,
  traits: ["FILM Drum Kingdom"],
  attribute: "special",
  effect: "NULL",
  i18n: op08Musshuru011I18n,
};
