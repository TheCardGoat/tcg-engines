import type { CharacterCard } from "@tcg/op-types";
import { op09Peachbeard094I18n } from "./094-peachbeard.i18n.ts";

export const op09Peachbeard094: CharacterCard = {
  id: "OP09-094",
  canonicalId: "OP09-094",
  slug: "peachbeard",
  name: "Peachbeard",
  printings: [
    {
      id: "OP09-094",
      artId: "OP09-094",
      setCode: "OP09",
      collectorNumber: "094",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-094.jpg",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "OP09",
  cost: 3,
  power: 5000,
  counter: 1000,
  traits: ["Peachbeard Pirates Blackbeard Pirates Allies"],
  attribute: "slash",
  i18n: op09Peachbeard094I18n,
};
