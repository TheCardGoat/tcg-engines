import type { CharacterCard } from "@tcg/op-types";
import { op17RoronoaZoro035I18n } from "./op17-035-roronoa-zoro.i18n.ts";

export const op17RoronoaZoro035: CharacterCard = {
  id: "OP17-035",
  canonicalId: "OP17-035",
  slug: "roronoa-zoro/op17-035",
  name: "Roronoa Zoro",
  printings: [
    {
      id: "OP17-035",
      artId: "OP17-035",
      setCode: "OP17",
      collectorNumber: "035",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP17-035_8YkCFTv.jpg",
      label: "Roronoa Zoro (035)",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "OP17",
  cost: 7,
  power: 8000,
  counter: 2000,
  traits: ["East Blue Straw Hat Crew"],
  attribute: "slash",
  i18n: op17RoronoaZoro035I18n,
};
