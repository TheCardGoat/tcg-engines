import type { CharacterCard } from "@tcg/op-types";
import { eb01Crocus041I18n } from "./041-crocus.i18n.ts";

export const eb01Crocus041: CharacterCard = {
  id: "EB01-041",
  canonicalId: "EB01-041",
  slug: "crocus/eb01-041",
  name: "Crocus",
  printings: [
    {
      id: "EB01-041",
      artId: "EB01-041",
      setCode: "EB01",
      collectorNumber: "041",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB01-041.jpg",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "EB01",
  cost: 6,
  power: 8000,
  counter: 1000,
  traits: ["Former Roger Pirates"],
  attribute: "wisdom",
  i18n: eb01Crocus041I18n,
};
