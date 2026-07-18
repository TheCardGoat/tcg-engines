import type { CharacterCard } from "@tcg/op-types";
import { op01Mocha081I18n } from "./081-mocha.i18n.ts";

export const op01Mocha081: CharacterCard = {
  id: "OP01-081",
  canonicalId: "OP01-081",
  slug: "mocha/op01-081",
  name: "Mocha",
  printings: [
    {
      id: "OP01-081",
      artId: "OP01-081",
      setCode: "OP01",
      collectorNumber: "081",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-081.jpg",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "OP01",
  cost: 3,
  power: 5000,
  counter: 1000,
  traits: ["Punk Hazard"],
  attribute: "strike",
  i18n: op01Mocha081I18n,
};
