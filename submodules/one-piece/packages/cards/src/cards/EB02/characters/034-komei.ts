import type { CharacterCard } from "@tcg/op-types";
import { eb02Komei034I18n } from "./034-komei.i18n.ts";

export const eb02Komei034: CharacterCard = {
  id: "EB02-034",
  canonicalId: "EB02-034",
  slug: "komei",
  name: "Komei",
  printings: [
    {
      id: "EB02-034",
      artId: "EB02-034",
      setCode: "EB02",
      collectorNumber: "034",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB02-034.jpg",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "EB02",
  cost: 4,
  power: 6000,
  counter: 1000,
  traits: ["Navy Foxy Pirates"],
  attribute: "wisdom",
  i18n: eb02Komei034I18n,
};
