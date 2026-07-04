import type { CharacterCard } from "@tcg/op-types";
import { op12EdwardNewgate002I18n } from "./002-edward-newgate.i18n.ts";

export const op12EdwardNewgate002: CharacterCard = {
  id: "OP12-002",
  canonicalId: "OP12-002",
  slug: "edward-newgate/op12-002",
  name: "Edward.Newgate",
  printings: [
    {
      id: "OP12-002",
      artId: "OP12-002",
      setCode: "OP12",
      collectorNumber: "002",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP12-002_KDLyHsQ.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "UC",
  setId: "OP12",
  cost: 5,
  power: 6000,
  counter: 2000,
  traits: ["Whitebeard Pirates"],
  attribute: "special",
  i18n: op12EdwardNewgate002I18n,
};
