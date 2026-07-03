import type { CharacterCard } from "@tcg/op-types";
import { eb03Kalifa040I18n } from "./040-kalifa.i18n.ts";

export const eb03Kalifa040: CharacterCard = {
  id: "EB03-040",
  canonicalId: "EB03-040",
  slug: "kalifa/eb03-040",
  name: "Kalifa",
  printings: [
    {
      id: "EB03-040",
      artId: "EB03-040",
      setCode: "EB03",
      collectorNumber: "040",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB03-040_P6i7mlb.jpg",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "EB03",
  cost: 5,
  power: 6000,
  counter: 2000,
  traits: ["CP9"],
  attribute: "special",
  i18n: eb03Kalifa040I18n,
};
