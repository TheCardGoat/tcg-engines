import type { CharacterCard } from "@tcg/op-types";
import { op06Gasparde005I18n } from "./005-gasparde.i18n.ts";

export const op06Gasparde005: CharacterCard = {
  id: "OP06-005",
  canonicalId: "OP06-005",
  slug: "gasparde",
  name: "Gasparde",
  printings: [
    {
      id: "OP06-005",
      artId: "OP06-005",
      setCode: "OP06",
      collectorNumber: "005",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-005.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "OP06",
  cost: 6,
  power: 8000,
  counter: 1000,
  traits: ["FILM Former Navy Gasparde Pirates"],
  attribute: "special",
  i18n: op06Gasparde005I18n,
};
