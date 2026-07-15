import type { CharacterCard } from "@tcg/op-types";
import { op12Duval011I18n } from "./011-duval.i18n.ts";

export const op12Duval011: CharacterCard = {
  id: "OP12-011",
  canonicalId: "OP12-011",
  slug: "duval/op12-011",
  name: "Duval",
  printings: [
    {
      id: "OP12-011",
      artId: "OP12-011",
      setCode: "OP12",
      collectorNumber: "011",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP12-011_04BkMOJ.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "OP12",
  cost: 5,
  power: 7000,
  counter: 1000,
  traits: ["The Flying Fish Riders"],
  attribute: "ranged",
  i18n: op12Duval011I18n,
};
