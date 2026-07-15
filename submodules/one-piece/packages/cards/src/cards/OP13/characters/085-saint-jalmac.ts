import type { CharacterCard } from "@tcg/op-types";
import { op13SaintJalmac085I18n } from "./085-saint-jalmac.i18n.ts";

export const op13SaintJalmac085: CharacterCard = {
  id: "OP13-085",
  canonicalId: "OP13-085",
  slug: "saint-jalmac",
  name: "Saint Jalmac",
  printings: [
    {
      id: "OP13-085",
      artId: "OP13-085",
      setCode: "OP13",
      collectorNumber: "085",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP13-085_Lfy7m2J.jpg",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "OP13",
  cost: 2,
  power: 4000,
  counter: 1000,
  traits: ["Celestial Dragons"],
  attribute: "ranged",
  i18n: op13SaintJalmac085I18n,
};
