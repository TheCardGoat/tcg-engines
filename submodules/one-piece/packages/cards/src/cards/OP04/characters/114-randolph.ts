import type { CharacterCard } from "@tcg/op-types";
import { op04Randolph114I18n } from "./114-randolph.i18n.ts";

export const op04Randolph114: CharacterCard = {
  id: "OP04-114",
  canonicalId: "OP04-114",
  slug: "randolph/op04-114",
  name: "Randolph",
  printings: [
    {
      id: "OP04-114",
      artId: "OP04-114",
      setCode: "OP04",
      collectorNumber: "114",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-114.jpg",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "OP04",
  cost: 5,
  power: 7000,
  counter: 1000,
  traits: ["Big Mom Pirates", "Homies"],
  attribute: "slash",
  i18n: op04Randolph114I18n,
};
