import type { CharacterCard } from "@tcg/op-types";
import { op06BearKing012I18n } from "./012-bear-king.i18n.ts";

export const op06BearKing012: CharacterCard = {
  id: "OP06-012",
  canonicalId: "OP06-012",
  slug: "bear-king",
  name: "Bear.King",
  printings: [
    {
      id: "OP06-012",
      artId: "OP06-012",
      setCode: "OP06",
      collectorNumber: "012",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-012.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "UC",
  setId: "OP06",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["FILM Trump Pirates"],
  attribute: "strike",
  effect:
    "If your opponent has a Leader or Character with a base power of 6000 or more, this Character cannot be K.O.'d in battle.",
  i18n: op06BearKing012I18n,
};
