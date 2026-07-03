import type { CharacterCard } from "@tcg/op-types";
import { op09Jozu049I18n } from "./049-jozu.i18n.ts";

export const op09Jozu049: CharacterCard = {
  id: "OP09-049",
  canonicalId: "OP09-049",
  slug: "jozu/op09-049",
  name: "Jozu",
  printings: [
    {
      id: "OP09-049",
      artId: "OP09-049",
      setCode: "OP09",
      collectorNumber: "049",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-049.jpg",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "OP09",
  cost: 4,
  power: 6000,
  counter: 1000,
  traits: ["Whitebeard Pirates"],
  attribute: "strike",
  i18n: op09Jozu049I18n,
};
