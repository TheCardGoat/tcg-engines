import type { CharacterCard } from "@tcg/op-types";
import { op16Arlong023I18n } from "./op16-023-arlong.i18n.ts";

export const op16Arlong023: CharacterCard = {
  id: "OP16-023",
  canonicalId: "OP16-023",
  slug: "arlong/op16-023",
  name: "Arlong",
  printings: [
    {
      id: "OP16-023",
      artId: "OP16-023",
      setCode: "OP16",
      collectorNumber: "023",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP16-023_26HAU5v.jpg",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "OP16",
  cost: 1,
  power: 3000,
  counter: 1000,
  traits: ["Fish-Man The Sun Pirates Impel Down"],
  attribute: "slash",
  i18n: op16Arlong023I18n,
};
