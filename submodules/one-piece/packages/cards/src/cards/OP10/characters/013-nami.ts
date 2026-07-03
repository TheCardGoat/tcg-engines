import type { CharacterCard } from "@tcg/op-types";
import { op10Nami013I18n } from "./013-nami.i18n.ts";

export const op10Nami013: CharacterCard = {
  id: "OP10-013",
  canonicalId: "OP10-013",
  slug: "nami/op10-013",
  name: "Nami",
  printings: [
    {
      id: "OP10-013",
      artId: "OP10-013",
      setCode: "OP10",
      collectorNumber: "013",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP10-013.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "OP10",
  cost: 5,
  power: 7000,
  counter: 1000,
  traits: ["Straw Hat Crew Punk Hazard"],
  attribute: "strike",
  i18n: op10Nami013I18n,
};
