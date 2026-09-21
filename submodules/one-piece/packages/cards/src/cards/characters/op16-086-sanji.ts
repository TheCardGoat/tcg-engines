import type { CharacterCard } from "@tcg/op-types";
import { op16Sanji086I18n } from "./op16-086-sanji.i18n.ts";

export const op16Sanji086: CharacterCard = {
  id: "OP16-086",
  canonicalId: "OP16-086",
  slug: "sanji/op16-086",
  name: "Sanji",
  printings: [
    {
      id: "OP16-086",
      artId: "OP16-086",
      setCode: "OP16",
      collectorNumber: "086",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP16-086_xLwhNwW.jpg",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "OP16",
  cost: 8,
  power: 9000,
  counter: 2000,
  traits: ["Land of Wano Straw Hat Crew"],
  attribute: "strike",
  i18n: op16Sanji086I18n,
};
