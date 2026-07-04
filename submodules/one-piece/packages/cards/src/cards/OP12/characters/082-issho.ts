import type { CharacterCard } from "@tcg/op-types";
import { op12Issho082I18n } from "./082-issho.i18n.ts";

export const op12Issho082: CharacterCard = {
  id: "OP12-082",
  canonicalId: "OP12-082",
  slug: "issho/op12-082",
  name: "Issho",
  printings: [
    {
      id: "OP12-082",
      artId: "OP12-082",
      setCode: "OP12",
      collectorNumber: "082",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP12-082_rsuRLpC.jpg",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "OP12",
  cost: 8,
  power: 10000,
  counter: 1000,
  traits: ["Navy Dressrosa"],
  attribute: "slash",
  i18n: op12Issho082I18n,
};
