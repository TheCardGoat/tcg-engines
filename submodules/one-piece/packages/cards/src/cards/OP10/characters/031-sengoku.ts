import type { CharacterCard } from "@tcg/op-types";
import { op10Sengoku031I18n } from "./031-sengoku.i18n.ts";

export const op10Sengoku031: CharacterCard = {
  id: "OP10-031",
  canonicalId: "OP10-031",
  slug: "sengoku/op10-031",
  name: "Sengoku",
  printings: [
    {
      id: "OP10-031",
      artId: "OP10-031",
      setCode: "OP10",
      collectorNumber: "031",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP10-031.jpg",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "OP10",
  cost: 5,
  power: 7000,
  counter: 1000,
  traits: ["Navy Dressrosa"],
  attribute: "wisdom",
  i18n: op10Sengoku031I18n,
};
