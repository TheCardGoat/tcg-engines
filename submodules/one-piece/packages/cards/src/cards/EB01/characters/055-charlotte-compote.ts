import type { CharacterCard } from "@tcg/op-types";
import { eb01CharlotteCompote055I18n } from "./055-charlotte-compote.i18n.ts";

export const eb01CharlotteCompote055: CharacterCard = {
  id: "EB01-055",
  canonicalId: "EB01-055",
  slug: "charlotte-compote",
  name: "Charlotte Compote",
  printings: [
    {
      id: "EB01-055",
      artId: "EB01-055",
      setCode: "EB01",
      collectorNumber: "055",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB01-055.jpg",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "EB01",
  cost: 7,
  power: 9000,
  counter: 1000,
  traits: ["Big Mom Pirates"],
  attribute: "wisdom",
  i18n: eb01CharlotteCompote055I18n,
};
