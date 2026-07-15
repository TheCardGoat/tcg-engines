import type { CharacterCard } from "@tcg/op-types";
import { eb02AllHuntGrount042I18n } from "./042-all-hunt-grount.i18n.ts";

export const eb02AllHuntGrount042: CharacterCard = {
  id: "EB02-042",
  canonicalId: "EB02-042",
  slug: "all-hunt-grount",
  name: "All-Hunt Grount",
  printings: [
    {
      id: "EB02-042",
      artId: "EB02-042",
      setCode: "EB02",
      collectorNumber: "042",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB02-042.jpg",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "EB02",
  cost: 6,
  power: 8000,
  counter: 1000,
  traits: ["Navy"],
  attribute: "strike",
  i18n: eb02AllHuntGrount042I18n,
};
