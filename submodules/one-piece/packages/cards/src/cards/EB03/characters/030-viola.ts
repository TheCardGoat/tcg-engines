import type { CharacterCard } from "@tcg/op-types";
import { eb03Viola030I18n } from "./030-viola.i18n.ts";

export const eb03Viola030: CharacterCard = {
  id: "EB03-030",
  canonicalId: "EB03-030",
  slug: "viola/eb03-030",
  name: "Viola",
  printings: [
    {
      id: "EB03-030",
      artId: "EB03-030",
      setCode: "EB03",
      collectorNumber: "030",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB03-030_Ps0TueZ.jpg",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "EB03",
  cost: 5,
  power: 6000,
  counter: 2000,
  traits: ["Dressrosa"],
  attribute: "special",
  i18n: eb03Viola030I18n,
};
