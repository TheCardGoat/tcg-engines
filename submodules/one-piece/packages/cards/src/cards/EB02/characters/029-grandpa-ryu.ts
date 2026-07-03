import type { CharacterCard } from "@tcg/op-types";
import { eb02GrandpaRyu029I18n } from "./029-grandpa-ryu.i18n.ts";

export const eb02GrandpaRyu029: CharacterCard = {
  id: "EB02-029",
  canonicalId: "EB02-029",
  slug: "grandpa-ryu",
  name: "Grandpa Ryu",
  printings: [
    {
      id: "EB02-029",
      artId: "EB02-029",
      setCode: "EB02",
      collectorNumber: "029",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB02-029.jpg",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "EB02",
  cost: 3,
  power: 5000,
  counter: 1000,
  traits: ["Animal East Blue"],
  attribute: "wisdom",
  i18n: eb02GrandpaRyu029I18n,
};
