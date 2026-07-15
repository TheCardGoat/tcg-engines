import type { CharacterCard } from "@tcg/op-types";
import { eb02DonAccino004I18n } from "./004-don-accino.i18n.ts";

export const eb02DonAccino004: CharacterCard = {
  id: "EB02-004",
  canonicalId: "EB02-004",
  slug: "don-accino",
  name: "Don Accino",
  printings: [
    {
      id: "EB02-004",
      artId: "EB02-004",
      setCode: "EB02",
      collectorNumber: "004",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB02-004.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "EB02",
  cost: 8,
  power: 10000,
  counter: 1000,
  traits: ["Accino Family"],
  attribute: "special",
  i18n: eb02DonAccino004I18n,
};
