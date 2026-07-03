import type { CharacterCard } from "@tcg/op-types";
import { op12Buffalo110I18n } from "./110-buffalo.i18n.ts";

export const op12Buffalo110: CharacterCard = {
  id: "OP12-110",
  canonicalId: "OP12-110",
  slug: "buffalo/op12-110",
  name: "Buffalo",
  printings: [
    {
      id: "OP12-110",
      artId: "OP12-110",
      setCode: "OP12",
      collectorNumber: "110",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP12-110_BSlmvNZ.jpg",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "OP12",
  cost: 3,
  power: 5000,
  counter: 1000,
  traits: ["Donquixote Pirates"],
  attribute: "strike",
  i18n: op12Buffalo110I18n,
};
