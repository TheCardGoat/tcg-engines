import type { CharacterCard } from "@tcg/op-types";
import { op02RoronoaZoro043I18n } from "./043-roronoa-zoro.i18n.ts";

export const op02RoronoaZoro043: CharacterCard = {
  id: "OP02-043",
  canonicalId: "OP02-043",
  slug: "roronoa-zoro/op02-043",
  name: "Roronoa Zoro",
  printings: [
    {
      id: "OP02-043",
      artId: "OP02-043",
      setCode: "OP02",
      collectorNumber: "043",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-043.jpg",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "OP02",
  cost: 4,
  power: 6000,
  counter: 1000,
  traits: ["Film Straw Hat Crew Supernovas"],
  attribute: "slash",
  effect: "NULL",
  i18n: op02RoronoaZoro043I18n,
};
