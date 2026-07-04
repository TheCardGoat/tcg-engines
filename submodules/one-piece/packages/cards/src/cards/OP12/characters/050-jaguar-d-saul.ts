import type { CharacterCard } from "@tcg/op-types";
import { op12JaguarDSaul050I18n } from "./050-jaguar-d-saul.i18n.ts";

export const op12JaguarDSaul050: CharacterCard = {
  id: "OP12-050",
  canonicalId: "OP12-050",
  slug: "jaguar-d-saul/op12-050",
  name: "Jaguar.D.Saul",
  printings: [
    {
      id: "OP12-050",
      artId: "OP12-050",
      setCode: "OP12",
      collectorNumber: "050",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP12-050_3wAafnU.jpg",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "UC",
  setId: "OP12",
  cost: 6,
  power: 7000,
  counter: 1000,
  traits: ["Giant Navy Ohara"],
  attribute: "strike",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)",
  effects: {
    keywords: ["blocker"],
  },
  i18n: op12JaguarDSaul050I18n,
};
